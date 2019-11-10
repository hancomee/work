import {Events} from "../../../lib/core/events";
import {DOM} from "../../../lib/core/_dom/DOM";
import {Arrays} from "../../../lib/core/support/Arrays";
import _selector = Arrays._selector;
import _map = Arrays._map;

class Offset {
    private start: number
    private center: number
    private end: number

    constructor(public element: HTMLElement) {
        this.reset();
    }

    /*
     *  위치가 이동했을수도 있으므로 재계산용 메서드
     */
    reset() {
        let {element} = this,
            s = this.start = DOM.offset(element).top,
            h = element.offsetHeight;

        this.end = s + element.offsetHeight;
        this.center = s + Math.ceil(h / 2);
    }

    up(pos: number) {
        return this.end > pos && this.center < pos;
    }

    down(pos: number) {
        return this.start < pos && this.center > pos;
    }
}


export class DragSort {

    private list: Offset[]

    private event: Events
    private y = 0;
    private handler

    constructor() {
        this.event = new Events(document, 'dragover', (e: MouseEvent) => {
            let
                isUp = e.pageY < this.y,
                y = this.y = e.pageY,
                matched = _selector(this.list, offset => isUp ? offset.up(y) : offset.down(y));

            // ① 매치되는게 있으면
            if (matched) {
                this.handler(matched.element, isUp);
                matched.reset();
            }
        }).off();
    }

    on(list: ArrayLike<HTMLElement>, handler) {
        this.list = _map(list, l => new Offset(l));
        this.handler = handler;
        this.event.on();
        return this;
    }

    off() {
        this.event.off();
        return this;
    }

}