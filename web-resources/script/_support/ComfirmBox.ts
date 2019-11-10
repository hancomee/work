import {EventsGroup} from "../../lib/core/events";
import {DOM} from "../../lib/core/_dom/DOM";
import className = DOM.className;
import {Forms} from "../../lib/core/support/Forms";
import set = Forms.set;

let cName = ['confirm-active'];

export class ConfirmBox {

    eventTarget: HTMLElement
    private events: EventsGroup
    private handler

    constructor(public element: HTMLElement) {
        this.events = new EventsGroup().off()
            .register(document, 'click', (e) => {


                /*
                 *   여러가지 역할을 하는 로직이다.
                 *   ① click이벤트에 의해 comfirmbox를 구동할 경우, event가 attach되자마자
                 *      바로 아래 로직이 불려서 오동작하는 걸 방지한다.
                 */
                if(this.eventTarget.contains(e.target)) return;

                let target = <HTMLElement>e.target;
                if (target.hasAttribute('data-submit')) {
                    this.done(true).off();
                }
                if (target.hasAttribute('data-cancel') || !element.contains(target)) {
                    this.done(false).off();
                }

            })
    }


    on(x: number, y: number, eventTarget: HTMLElement, handler: (flag: boolean) => void) {

        let {element, element: {offsetWidth}} = this,
            {innerWidth} = window;

        if (this.handler) this.done(false);
        this.handler = handler;
        className(this.eventTarget = eventTarget, cName, true);

        // flip
        if(innerWidth < x + offsetWidth) {
            x -= offsetWidth;
        }
        element.setAttribute('style', 'top: ' + y + 'px; left: ' + x + 'px;');
        element.classList.add('on');

        // 만약 이벤트 중이라면 현재 이벤트를 건너기 위함
        setTimeout(()=>this.events.on())
        return this;
    }

    done(flag: boolean) {
        className(this.eventTarget, cName, false);
        this.handler(flag);
        this.eventTarget = null;
        return this;
    }

    off() {
        this.element.classList.remove('on');
        this.events.off();
        return this;
    }
}