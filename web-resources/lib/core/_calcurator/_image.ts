const r = /(\d+)deg\)/i;

export const

    __rotate = (ele: HTMLElement) => {
        let {transform} = ele.style as any;
        return (transform = r.exec(transform)) ? parseInt(transform[1]) : 0;
    },

    // n이 N이 되기 위한 비율
    __rate = (N: number, n: number) => (N - n) / n,

    _adjust = (W: number, H: number, w: number, h: number) => {
        let height = h + (__rate(W, w) * h);

        if (height > H) return {w: w + (__rate(H, h) * w), h: H};
        return {w: W, h: height};
    },

    __tilt = (rotate: number, r = Math.abs(rotate % 360)) => {
        return r === 90 || r === 270
    },
    __ratio = (num1: number, num1c: number, num2: number) => {
        return num2 + (num2 * ((num1c - num1) / num1))
    },

    // 외부 사이즈(W,H)에 딱 맞추기
    // 마지막 인자가 true면 무조건 외부사이즈에 맞춤. 아니면 본래 사이즈
    __adjust = (W: number, H: number, w: number, h: number, forceSize = true) => {
        let size: { w: number, h: number }, pos: { x: number, y: number };

        // 강제 맞춤옵션이거나, 이미지가 대지보다 클 경우
        if (forceSize || W < w || H < h) size = _adjust(W, H, w, h);
        else size = {w: w, h: h};

        pos = __center(W, H, size.w, size.h);
        return {w: size.w, h: size.h, x: pos.x, y: pos.y};
    },

    __alignment = (w: number, h: number, rotate: number, W: number, H: number) => {

        if (__tilt(rotate)) {
            let maxHeight = __ratio(w, H, h);

            if (maxHeight > W) {
                w = __ratio(h, W, w);
                return [(W - w) / 2, (H - W) / 2, w, W]
            } else {
                w = H;
                return [(W - w) / 2, (H - maxHeight) / 2, w, maxHeight];
            }
        }

        let maxHeight = __ratio(w, W, h);

        // 세로를 딱 맞춰야 할 경우
        if (maxHeight > H) {
            w = __ratio(h, H, w);
            return [(W - w) / 2, 0, w, H]
        } else {
            h = maxHeight;
            return [0, (H - h) / 2, W, h];
        }
    },

    // from에서 to로 변할때 val의 변환값
    __resize = (from: number, to: number, val: number) => {
        let ratio = (to - from) / from;
        return Math.floor(val + (val * ratio));
    },

    // 가로 사이즈에 딱 맞추기
    __adjustWidth = (W: number, H: number, w: number, h: number) => {
        return {w: W, h: h + Math.round(__rate(W, w) * h)};
    },

    // 세로사이즈에 딱 맞추기
    __adjustHeigth = (W: number, H: number, w: number, h: number) => {
        return {w: w + Math.round(__rate(H, h) * w), h: H};
    },

    // 딱 맞춘
    __adjustScale2 = (container: HTMLElement, media: HTMLVideoElement | HTMLImageElement, rotate: number) => {
        let W = container.offsetWidth, H = container.offsetHeight,
            w = media.width, h = media.height,
            tilt = __tilt(rotate),
            from,
            to;

        if (tilt) {
            to = h;
            h = w;
            w = to;
        }

        if ((H - h) > (W - w)) {
            from = W;
            to = w;
        } else {
            from = H;
            to = h;
        }

        return 1 + ((from - to) / to);
    },

    __adjustScale = ({W, H, w, h}: { W: number, H: number, w: number, h: number }, rotate: number) => {
        let tilt = __tilt(rotate),
            from,
            to;

        if (tilt) {
            to = h;
            h = w;
            w = to;
        }

        if ((H - h) > (W - w)) {
            from = W;
            to = tilt ? H : W;
        } else {
            from = H;
            to = tilt ? H : W;
        }

        return 1 + ((from - to) / to);
    },

    // 가운데 맞춤
    __center = (W: number, H: number, w: number, h: number) => {
        return {x: Math.round((W - w) / 2), y: Math.round((H - h) / 2)};
    };

/*
 *  핀터레스트같은 꽉 채워진 퍼즐같은 이미지 만들기
 */
interface MosaicUnit {
    width: number,
    height: number
}

type handler<T> = (this: T, unit: T, top: number, left: number, width: number, height: number, index: number, colNum: number) => void;


/*
 *  ## 단순히 이미지를 (좌 -> 우)로 박스 쌓듯이 쌓는다.
 *
 *  전체 가로사이즈와 분할갯수를 가지고 이미지 위치를 설정한다.
 *  재사용을 위해 마지막 높이값을 반환한다.
 */
export function __puzzle<T extends MosaicUnit>(values: T[],
                                               split: number,           //
                                               outerWidth: number,      // 전체 가로 사이즈
                                               call: handler<T>,        // 콜백함수
                                               tops: number[] = []      // 시작높이
) {

    let width = Math.round(outerWidth / split),
        index = split;

    while (index-- > 0)
        if (tops[index] == null) tops[index] = 0;

    values.forEach(function (v, i) {
        let newHeight = __resize(v.width, width, v.height),
            pos = i % split;
        call.call(v, v, tops[pos], width * pos, width, newHeight, index++, pos);
        tops[pos] = tops[pos] + newHeight; // 높이 보정
    });

    return tops;
}

/*
 *  ## [튜닝버전] 높이를 봐가면서 쌓기
 */
export function __puzzleTune<T extends MosaicUnit>(values: T[],
                                                   split: number,           //
                                                   outerWidth: number,      // 전체 가로 사이즈
                                                   call: handler<T>,        // 콜백함수
                                                   tops: number[] = []      // 시작높이
) {

    let width = Math.floor(outerWidth / split),
        index = split;

    while (index-- > 0)
        if (tops[index] == null) tops[index] = 0;

    values.forEach(function (v, i) {
        let newHeight = __resize(v.width, width, v.height),
            pos = _min(tops);
        call.call(v, v, tops[pos], width * pos, width, newHeight, index++, pos);
        tops[pos] = tops[pos] + newHeight; // 높이 보정
    });

    return tops;
}

function _min(array: number[]) {
    let result = 0, i = 1, l = array.length, val = array[0];
    for (; i < l; i++) {
        if (array[i] < val) {
            val = array[result = i];
        }
    }
    return result;
}