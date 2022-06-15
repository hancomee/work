let len = 0;

const
    r = /input|textarea/i,
    {slice} = Array.prototype,
    listeners = [], keySet = {},
    downHandler = (e: KeyboardEvent) => {

        // <input>, <textarea>에 입력중인건 거른다.
        if (!r.test(e['target']['tagName']) && !keySet[e.key]) {
            let paths = slice.call(document.querySelectorAll(':hover')),
                target = paths[paths.length - 1],
                i = len;
            if(!target) return;
            while (i-- > 0) {
                if (listeners[i][0] === document || paths.indexOf(listeners[i][0]) !== -1)
                    listeners[i][1](e, target);
            }
        }
        keySet[e.key] = true;
    },
    upHandler = (e: KeyboardEvent) => {
        keySet[e.key] = false;
    };


document.addEventListener('keydown', downHandler);
document.addEventListener('keyup', upHandler);

/*
 * keydown 이벤트를 한번만 잡아준다.
 * target은 :hover의 가장 하위 엘리먼트
 */
export function __$keyDownListener(ele: HTMLElement | Document, handler: (e: KeyboardEvent, target: HTMLElement) => void) {
    listeners[len++] = [ele, handler];
}