/**
 * Created by hellofunc on 2017-02-28.
 */


import {NameMap} from "./_collections/NameMap";
import {Arrays} from "./support/Arrays";
import {Access} from "./access";
import {__returnTrue} from "./_snippet/__returnTrue";

type ISwitch = ko.types.event.Switch;

export namespace iEvents {

    export namespace dataEvent {


        export interface directive<T> {
            [index: string]: (t: T) => any
        }

        export type dispatcher<T> = (target: HTMLElement, obj: T, attrValue: string, e: Event) => any;
    }
}


export class Events {

    isActive = false

    constructor(public target: EventTarget, public type: string, public handler) {
        this.on();
    }

    setTarget(t: EventTarget) {
        let {target, isActive} = this;
        if (t === target) return this;
        if (isActive) this.off();
        this.target = t;
        if (isActive) this.on();
        return this;
    }

    on() {
        if (!this.isActive) {
            this.target.addEventListener(this.type, this.handler);
            this.isActive = true;
        }
        return this;
    }

    off() {
        if (this.isActive) {
            this.target.removeEventListener(this.type, this.handler);
            this.isActive = false;
        }
        return this;
    }
}


export class EventsGroup {
    isActive = true;
    private map = new NameMap<Events>();

    register(event: Events)
    register(element: EventTarget, type: string, handler)
    register(element, type?, handler?): EventsGroup {
        if (typeof type === 'string') {
            let e = new Events(element, type.split(/\./)[0], handler);
            if (!this.isActive) e.off();
            this.map.add(type, e);
        }
        else {
            if (!this.isActive) element.off();
            this.map.add(element.type, element);
        }
        return this;
    }

    on(): EventsGroup
    on(name: string): EventsGroup
    on(n?) {
        if (!this.isActive) {
            this.map.get(n).forEach(v => v.on());
            this.isActive = true;
        }
        return this;
    }

    off(): EventsGroup
    off(name: string): EventsGroup
    off(n?) {
        if (this.isActive) {
            this.map.get(n).forEach(v => v.off());
            this.isActive = false;
        }
        return this;
    }
}


export class TargetEvent {

    isActive = false;

    private events = []
    private target: EventTarget

    register(type: string, handler): TargetEvent {
        this.events.push({type: type, handler: handler});
        return this;
    }

    on(own: EventTarget) {
        let {target} = this;

        if (target) {
            if (target === own) return this;
            this.off();
        }

        this.events.forEach(v => own.addEventListener(v.type, v.handler));
        this.target = own;
        this.isActive = true;
        return this;
    }

    off() {
        let {target} = this;
        if (target) {
            this.events.forEach(v => target.removeEventListener(v.type, v.handler));
            this.isActive = false;
            this.target = null;
        }
        return this;
    }
}

export namespace Events {


    import primitive = Access.primitive;
    import _makeArray = Arrays._makeArray;

    function noop(e) {

    }

    function closest(target: HTMLElement, selector: string, ele): HTMLElement {
        let list = target.querySelectorAll(selector), l = list.length;
        while (l-- > 0) if (list[l]['contains'](ele)) return <any>list[l];
        return null;
    }

    export function mine(target: HTMLElement, type: string, handler: (e) => any) {
        return new Events(target, type, function (e) {
            if (e.target === target) return handler.call(this, e);
        });
    }

    export function bind(target: HTMLElement, type: string, handler: (e) => any): Events
    export function bind(target: HTMLElement, type: string, selector: string, handler: (e, target: HTMLElement) => any): Events
    export function bind(target: HTMLElement, type: string, selector, handler?) {
        if (handler)
            return new Events(target, type, function (e) {
                let t = closest(target, selector, e.target);
                if (t) return handler.call(target, e, t);
            });
        else return new Events(target, type, selector);
    }

    export function map(target: HTMLElement, map: { [index: string]: any }) {
        let group = new EventsGroup(),
            p;
        for (p in map)
            typeof map[p] === 'function' && group.register(target, p, map[p].bind(map));
        return group;
    }

    export function keydown(ele: HTMLElement,
                            handler: (this: HTMLElement, e: KeyboardEvent) => void) {
        let key;
        return new EventsGroup()
            .register(ele, 'keyup', () => key = null)
            .register(ele, 'keypress', (e) => {
                let {keyCode} = e;
                if (keyCode !== key) {
                    key = keyCode;
                    handler.call(ele, e);
                }
            })
    }


    // noDuplicationd : 같은 문자열 입력은 무시
    export function acceptKeys(target: HTMLInputElement | HTMLTextAreaElement, handler, noDuplication = true) {
        let key: string = null;
        return new Events(target, 'keyup', (e: KeyboardEvent) => {
            let {value} = target;
            if (!noDuplication || value !== key) {
                key = value;
                handler(value, e);
            }
        });
    }

    /*
     *  키 입력에 따라 핸들러 호출
     */
    export let catchKey = (function () {

        class KeyEvents extends Events {

            count = 0;

            constructor(element: EventTarget, public keys: number[], handler, public upHandler) {
                super(element, 'keyevent', handler);
                this.on();
            }

            down() {
                this.handler(this.count++, this.target);
                return this;
            }

            up() {
                this.upHandler(this.count - 1, this.target);
                this.count = 0;
                return this;
            }

            on() {
                if (keyListener.indexOf(this) === -1) {
                    keyListener.push(this);
                    KEY_LISTEN.on();
                    this.isActive = true;
                }
                return this;
            }

            off() {
                let i = keyListener.indexOf(this);
                if (i !== -1) {
                    keyListener.splice(i, 1);
                    keyListener.length || KEY_LISTEN.off();
                    this.isActive = false;
                }
                return this;
            }
        }

        let keyListener: KeyEvents[] = [],

            /*
             *  ① document가 키 입력을 다 받는다.
             *  ② 등록된 element위에 마우스가 위치할때, 해당 키 입력에 따라 handler를 호출한다.
             */
            KEY_LISTEN = (function () {
                let keys = [];

                // 키 이벤트를 받는 그룹
                return new EventsGroup()
                    .register(document, 'keydown', (e: KeyboardEvent) => {
                        let {keyCode} = e,
                            hovers = <EventTarget[]>_makeArray(document.querySelectorAll(':hover'));

                        if (keys.indexOf(keyCode) === -1) keys.push(keyCode)

                        keyListener.forEach(v => {
                            if (hovers.indexOf(v.target) !== -1 && Arrays.equals(v.keys, keys))
                                v.down();
                        });
                    })
                    .register(document, 'keyup', (e: KeyboardEvent) => {
                        let i = keys.indexOf(e.keyCode);
                        if (i !== -1) keys.splice(i, 1);
                        if (!keys.length) {
                            keyListener.forEach(v => v.count !== 0 && v.up())
                        }
                    }).off();
            })();


        type Handler = (n: number, ele: HTMLElement) => void;

        // on/off 컨트롤러를 반환한다.
        return (element: EventTarget, keys: number[],
                handler: Handler, upHandler: Handler = noop) => {
            return new KeyEvents(element, keys, handler, upHandler);
        }
    })();


    // 해당 횟수만큼 이벤트를 리스닝한다.
    export function count(element: EventTarget, type: string, handler, count = 1) {
        if (count < 1) return;

        let dispatcher = function (...args) {
            count--;
            let rv = handler.apply(element, args);
            count < 1 && element.removeEventListener(type, dispatcher);
            return rv;
        }

        element.addEventListener(type, dispatcher);
    }

    export function listener(element: EventTarget, type: string, handler) {
        return new Events(element, type, handler);
    }


    export function listenGroup() {
        return new EventsGroup();
    }

    export function trigger(target: EventTarget, type: string, bubbles = true, cancelable = true) {
        if (typeof target[type] === 'function') target[type]();
        else {
            let e = document.createEvent('Events');
            e.initEvent(type, bubbles, cancelable);
            // 이미 진행중인 이벤트가 있다면 버블링 후에 동작하도록
            setTimeout(() => target.dispatchEvent(e), 0);
        }
    }

    export function custom(target: EventTarget, type: string, detail, bubbles = true, cancelable = true) {
        let e: CustomEvent = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        setTimeout(() => target.dispatchEvent(e), 0);
    }


    type WORK_HANDLERS = (val: string, target: HTMLElement, e: Event) => any
    type WORK_HANDLER = (key: string, val: string, target: HTMLElement, e: Event) => any

    export function eventWorks(element: EventTarget,
                               type: string,
                               handlers: ({ [index: string]: WORK_HANDLERS }) | WORK_HANDLER,
                               attrName = 'data-handler') {

        let target: HTMLElement,
            vName = attrName + '-value',
            isFun = typeof handlers === 'function' ? handlers : null;

        return new Events(element, type, (e) => {
            target = <HTMLElement>e.target;
            while (target && target !== element) {
                if (target.hasAttribute(attrName)) {
                    let prop = target.getAttribute(attrName),
                        val = target.getAttribute(vName);
                    if (isFun) return isFun(prop, val, target, e);
                    else if (handlers[prop]) handlers[prop](target.getAttribute(vName), target, e);
                    return;
                }
                target = target.parentElement;
            }
        });

    }


    /*
     *  event가 발생하면 target 엘리먼트부터 상위엘리먼트로 올라가면서
     *  어트리뷰트를 읽어 데이터맵을 만들어준다.
     */
    let r_read_split = /,\s*/;

    function eventProperty(target: HTMLElement, obj) {

        let v: string;

        // target 자체를
        if (v = target.getAttribute('data-element')) {
            obj[v] = target;
        }

        // property 이름
        if ((v = target.getAttribute('data-value')) && v.indexOf(':') !== -1) {
            let array = v.split(r_read_split), l = array.length;
            while (l-- > 0) {
                let [k, v] = array[l].split(':');
                obj[k] = primitive(v);
            }
        }

        return obj;
    }


    type DIRECTIVE<T> = iEvents.dataEvent.directive<T>
    type DISPATCHER<T> = iEvents.dataEvent.dispatcher<T>

    function getObject() {
        return {}
    }

    export function dataEvent(element: HTMLElement, type: string, attr: string, directive: DIRECTIVE<any>)
    export function dataEvent<T>(element: HTMLElement, type: string, attr: string, directive: DIRECTIVE<T>)
    export function dataEvent<T>(element: HTMLElement, type: string, attr: string,
                                 getObj: (e: Event, attrValue: string) => T, directive: DIRECTIVE<T>)
    export function dataEvent<T>(element: HTMLElement,
                                 type: string,                  // 이벤트 타입
                                 attr: string,                  // 이벤트
                                 getObj: (e: Event, attrValue: string) => T,       // directive에 전달될 데이터
                                 dispatcher: DISPATCHER<T>,     // loop 핸들러
                                 directive: DIRECTIVE<T>
    )
    export function dataEvent(element: HTMLElement, type: string, attr: string,
                              getObj?, dispatcher?, directive?) {

        // arguments : 4
        if (!dispatcher) {
            directive = getObj;
            getObj = getObject;
            dispatcher = __returnTrue;
        }
        // arguments : 5
        else if (!directive) {
            directive = dispatcher;
            dispatcher = __returnTrue;
        }

        return new Events(element, type, (e) => {
            let
                target = <HTMLElement>e.target,
                attrValue = target.getAttribute(attr),
                dir = directive[target.getAttribute(attr)];

            if (dir) {
                let obj = getObj(e, attrValue), limit = element, h = dispatcher;
                obj['event'] = e;
                while (target && (limit !== target)) {
                    eventProperty(target, obj);
                    if (h(target, obj, attrValue, e) === 'break') break;
                    target = target.parentElement
                }
                dir.call(directive, obj);
            }
        });
    }



    export function bubbleEvent(element: HTMLElement, type: string, attr: string, directive) {

        return new Events(element, type, (e) => {

            let target = <HTMLElement>e.target, prop: string, handler, obj;
            do {
                if (!obj) {
                    if (target.hasAttribute(attr)) {
                        prop = target.getAttribute(attr);
                        handler = directive[prop];
                        if (handler) obj = {target: target};
                    }
                }
                obj && eventProperty(target, obj);
                target = target.parentElement;
            } while (target && target !== element);

            if (obj) {
                directive['*'] && directive['*'](obj, e);
                handler.call(directive, obj, e);
            }
        });

    }

    /*
     *  click 이벤트에 의한 focus-in focus-out 토글 이벤트
     *
     */
    export let onFocus = (function () {

        let elements = [], index = 0;

        document.addEventListener('click', (e) => {

            if (!index) return;

            let i: number, checks = [],
                target = <HTMLElement>e.target;

            while (target) {

                for (i = 0; i < index; i++) {
                    if (elements[i].ele === target) checks[i] = true;
                }

                target = target.parentElement;
            }


            // blur
            for (i = 0; i < index; i++) {
                if (!checks[i]) elements[i].handler(false);
            }

            // focus
            for (i = 0; i < index; i++) {
                if (checks[i]) elements[i].handler(true);
            }
        });

        return (ele: HTMLElement, focusHandler, blurHandler) => {

            let active = false;

            elements[index++] = {
                ele: ele,
                handler(matched: boolean) {
                    if (matched) {
                        if (!active) {
                            active = true;
                            ele.classList.add('focus-in');
                            focusHandler();
                        }
                    } else {
                        if (active) {
                            active = false;
                            ele.classList.remove('focus-in');
                            blurHandler();
                        }
                    }

                }
            }

        };
    })();

    export function simpleTrigger(target: HTMLElement, type: string, bubbles = true, cancelable = true, data?) {
        let e = document.createEvent('Event');
        e.initEvent(type, true, true);
        e['data'] = data;
        return target.dispatchEvent(e);
    }

}



