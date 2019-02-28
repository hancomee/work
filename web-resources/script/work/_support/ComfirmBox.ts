import {EventsGroup} from "../../../lib/core/events";


export class ConfirmBox {

    private events: EventsGroup
    private handler
    private _skip = false

    constructor(public element: HTMLElement) {
        this.events = new EventsGroup().off()
            .register(document, 'click', (e) => {

                if (this._skip) {
                    this._skip = false;
                    return;
                }

                let target = <HTMLElement>e.target;
                if (target.hasAttribute('data-submit')) {
                    this.handler(true);
                    this.off();
                }
                if (target.hasAttribute('data-cancel') || !element.contains(target)) {
                    this.handler(false);
                    this.off();
                }

            })
    }

    on(x: number, y: number, handler: (flag: boolean) => void)
    on(e: MouseEvent, handler: (flag: boolean) => void)
    on(x, y, h?) {
        let {element} = this;

        if (!h) {
            h = y;
            y = x.pageY;
            x = x.pageX;
        }

        this._skip = true;

        if (this.handler) this.handler(false);
        this.handler = h;
        element.setAttribute('style', 'top: ' + y + 'px; left: ' + x + 'px;');
        element.classList.add('on');
        this.events.on();
        return this;
    }

    off() {
        this.element.classList.remove('on');
        this.events.off();
        return this;
    }
}