const
    __defaultHandler = (e: HTMLElement) => true,
    $parse = {
        translate(str, obj) {
            let [, x, y] = /([-.\d]+).*?([-.\d]+)/.exec(str);
            obj.x = parseFloat(x);
            obj.y = parseFloat(y);
        },
        scale(str, obj) {
            obj.scale = parseFloat(str);
        },
        rotate(str, obj) {
            obj.rotate = parseInt(str);
        }
    };


function __toString(obj) {
    let r = [];
    if (obj.x != null) r.push('translate(' + obj.x + 'px, ' + obj.y + 'px)');
    if (obj.scale != null) r.push('scale(' + obj.scale + ')');
    if (obj.rotate != null) r.push('rotate(' + obj.rotate + 'deg)');
    return r.join(' ');
}

function __toMap(transform: string | Element) {

    if (transform == null) return null;

    if (typeof transform !== 'string')
        return __toMap(transform['style']['transform']);

    let r = /(\w+)\(([^\)]+)\)/g,
        a: RegExpExecArray,
        data = {x: 0, y: 0, scale: 1, rotate: 0};

    while (a = r.exec(transform)) {
        r.lastIndex = a.index + a[0].length;
        $parse[a[1]] && $parse[a[1]](a[2], data);
    }

    return data;
}


export function __resizing(ele: HTMLElement, handler = __defaultHandler) {

    let
        $target: HTMLElement,
        __moveHandler,

        evts = {
            mousedown(e: MouseEvent) {
                let target = e.target as HTMLElement;

                if (target.tagName === 'IMG' && !target.hasAttribute('disabled') && handler(target)) {

                    let {pageX, pageY} = e,
                        value = __toMap(target),
                        {x, y} = value;

                    __moveHandler = (e: DragEvent) => {
                        value.x = x + e.pageX - pageX;
                        value.y = y + e.pageY - pageY;
                        target.style.transform = __toString(value);
                    }

                    $target = target;
                    e.stopPropagation();
                }
            },
            mouseleave: 'mouseup',
            mouseup(e) {
                $target = __moveHandler = null;
            },
            mousemove(e) {
                __moveHandler && __moveHandler(e);
            },
            dragstart(e: DragEvent) {
                e.preventDefault();
            },

            dblclick(e) {
                let target = e.target as HTMLImageElement;
                if (target.tagName === 'IMG' && !target.hasAttribute('disabled') && handler(target)) {
                    let map = __toMap(target);
                    map.rotate = map.rotate + 90;
                    target.style.transform = __toString(map);
                }
            },
            mousewheel(e: MouseEvent) {

                let target = e.target as HTMLElement;

                if (target.tagName === 'IMG' && !target.hasAttribute('disabled') && handler(target)) {

                    e.preventDefault();

                    const map = __toMap(target),
                        {clientX, clientY} = e,
                        {width, height, left, top} = target.getBoundingClientRect(),
                        {x, y, scale} = map,
                        change = (e['wheelDelta'] < 0 ? -1 : 1) * (scale * .3),        // 증감 스케일
                        newScale = scale + change,
                        newWidth = (width / scale) * newScale, newHeight = (height / scale) * newScale;

                    if (newWidth < 100 || newHeight < 100) return;

                    /*
                     *  변수가 많아 복잡해보이지만 단순한 로직이다.
                     *
                     *  transform:scale은 중심점을 기준으로 커진다.
                     *  중심점으로부터 마우스 포인터의 거리 비율만큼, 그 크기 증감분을 x,y에 적용한다.
                     *
                     *  단! scale 증감분 연산에 주의하라.
                     *  현재 스케일 값으로 width를 나눠, 본래의 width값을 찾는 것이 핵심이다.
                     */
                    const
                        imageX = clientX - left, imageY = clientY - top,            // 이미지 위에서의 x,y 좌표
                        centerX = width / 2, centerY = height / 2,                  // 이미지 중앙
                        distanceX = centerX - imageX, distanceY = centerY - imageY, // 중심축에서의 거리
                        changeWidth = (newWidth - width) / 2, changeHeight = (newHeight - height) / 2;


                    map.scale = newScale;
                    map.x = x + (changeWidth * (distanceX / centerX));
                    map.y = y + (changeHeight * (distanceY / centerY));
                    target.style.transform = __toString(map);

                }
            }
        };

    for (let p in evts)
        ele.addEventListener(p, typeof evts[p] === 'string' ? evts[evts[p]] : evts[p]);
}

