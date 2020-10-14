import {Arrays} from "../_array";
import __forEach = Arrays.__forEach;

type Handler = (this: HTMLElement, ele: HTMLElement, nodeType: number) => void | number;

function ___travel(element: HTMLElement, handler: Handler, stop: [number]) {

    __forEach(element.children, (ele) => {

        if (stop[0]) return;
        let v = handler.call(element, ele, ele.nodeType);

        /*
         * void : 계속탐색
         * -1 : 현재 아래로 중지
         * -2 : 아예 중지
         */
        if (v === -1) return;
        else if (v === -2) {
            stop[0] = 1;
            return;
        }
        ___travel(<any>ele, handler, stop);
    });

}

/*
 * handler return값
 * -1 : 하위객체 탐색 중지
 * -2 : 아예 중지
 */
export function __travel(element: HTMLElement, handler: Handler) {
    let v = handler.call(element, element, element.nodeType);
    if (v === -1 || v === -2) return;
    ___travel(element, handler, [0]);
}