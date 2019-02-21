import {EventsGroup} from "../../../lib/core/events";


export class ConfirmBox {

    private events: EventsGroup
    private handler

    constructor(public element: HTMLElement) {
        this.events = new EventsGroup().off()
            .register(document, 'click', (e) => {

                if (e['__skip']) return;

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

    on(e: MouseEvent, handler: (flag: boolean) => void) {
        let {element} = this;

        e['__skip'] = true;

        if(this.handler) this.handler(false);
        this.handler = handler;

        element.setAttribute('style',
            'top: ' + e.pageY + 'px; left: ' + e.pageX + 'px;');

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