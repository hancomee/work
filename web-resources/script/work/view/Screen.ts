// 시안 창
import {WorkFile, WorkItem} from "../_core/Work";
import {Calendar} from "../../../lib/core/calendar";
import {EventsGroup} from "../../../lib/core/events";
import {Mapping} from "../../../lib/core/support/Mapping";
import {DOM} from "../../../lib/core/dom";
import className = DOM.className;

let directive = {
    datetime(ele: HTMLElement, v: WorkFile) {
        ele.textContent = Calendar.format(v.datetime, 'yyyy-MM-dd(E) HH:mm');
    },
    name(ele: HTMLAnchorElement, v: Screen) {
        let {img} = v;
        if (img) {
            ele.href = '/workdata/' + v.path + img.getSaveName();
            ele.textContent = img.getOrigName();
        } else {
            ele.textContent = '';
        }
    },
    render(ele: HTMLElement, v: Screen) {
        let {img} = v;
        if (img) {
            ele.style.backgroundImage = 'url("/workdata/' + v.path + img.getSaveName() + '")';
        } else {
            ele.style.backgroundImage = '';
        }
    }
}

export class Screen extends Mapping {

    private index = 0
    private wheelEvent: EventsGroup

    mapper: HTMLElement
    item: WorkItem
    current: number
    total: number
    img: WorkFile

    directive = directive

    constructor(public element: HTMLElement, public path: string) {
        super();

        this.data = this;   // 자신을 data로 사용한다.

        let closeBtn = element.querySelector('.screen-nav-close');
        closeBtn.addEventListener('click', () => this.off());

        this.wheelEvent = new EventsGroup()
            .register(document, 'mousewheel', (e: MouseWheelEvent) => {
                let {total} = this,
                    move = this.index + (e['wheelDelta'] < 0 ? 1 : -1);

                if (move > -1 && move < total) {
                    this.render(move);
                }
                e.preventDefault();
            }).off();
    }

    render(index = this.index) {

        let {item: {draft}, element} = this, l = draft.length;

        // 파일이 없을때
        if (!l) {
            this.img = null;
            this.index = -1;
            this.current = this.total = 0;
            className(element, 'has-image', false);
        }

        // 파일이 있을때
        else {

            if (index < 0) index = 0;
            if (!(index < l)) index = l - 1;

            this.index = index;
            this.img = draft[index];
            this.current = index + 1;
            this.total = l;
            className(element, 'has-image', true);
        }

        super.$render(element);
        return this;
    }


    on(item: WorkItem, mapper: HTMLElement) {
        this.mapper = mapper;
        this.item = item;
        this.element.classList.add('on');
        this.wheelEvent.on();
        return this.render(0);
    }

    off() {
        this.wheelEvent.off();
        this.element.classList.remove('on');
        return this;
    }

}