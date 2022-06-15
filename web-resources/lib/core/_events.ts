/**
 * Created by hellofunc on 2017-02-28.
 */


import {NameMap} from "./support/NameMap";
import {Arrays} from "./_array";
import {Access} from "./_access";
import {__returnTrue} from "./_snippet/_returnTrue";
import {__noop} from "./_snippet/_noop";
import {__extend} from "./_core";


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
        } else {
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


    import primitive = Access.__primitive;
    import _makeArray = Arrays.__makeArray;
    import __forEach = Arrays.__forEach;
    import __primitive = Access.__primitive;


    function closest(target: HTMLElement, selector: string, ele): HTMLElement {
        let list = target.querySelectorAll(selector), l = list.length;
        while (l-- > 0) if (list[l]['contains'](ele)) return <any>list[l];
        return null;
    }

    export function __$mine(target: HTMLElement, type: string, handler: (e) => any) {
        return new Events(target, type, function (e) {
            if (e.target === target) return handler.call(this, e);
        });
    }

    export function __$bind(target: HTMLElement, type: string, handler: (e) => any): Events
    export function __$bind(target: HTMLElement, type: string, selector: string, handler: (e, target: HTMLElement) => any): Events
    export function __$bind(target: HTMLElement, type: string, selector, handler?) {
        if (handler)
            return new Events(target, type, function (e) {
                let t = closest(target, selector, e.target);
                if (t) return handler.call(target, e, t);
            });
        else return new Events(target, type, selector);
    }

    export function __$map(target: HTMLElement, map: { [index: string]: any }) {
        let group = new EventsGroup(),
            p;
        for (p in map)
            typeof map[p] === 'function' && group.register(target, p, map[p].bind(map));
        return group;
    }

    export function __$keydown(ele: HTMLElement,
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
    export function __$acceptKeys(target: HTMLInputElement | HTMLTextAreaElement, handler, noDuplication = true) {
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
    export let __$catchKey = (function () {

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
                            if (hovers.indexOf(v.target) !== -1 && Arrays.__equals(v.keys, keys))
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
                handler: Handler, upHandler: Handler = __noop) => {
            return new KeyEvents(element, keys, handler, upHandler);
        }
    })();


    // 해당 횟수만큼 이벤트를 리스닝한다.
    export function __$count(element: EventTarget, type: string, handler, count = 1) {
        if (count < 1) return;

        let dispatcher = function (...args) {
            count--;
            let rv = handler.apply(element, args);
            count < 1 && element.removeEventListener(type, dispatcher);
            return rv;
        }

        element.addEventListener(type, dispatcher);
    }

    export function __$listener(element: EventTarget, type: string, handler) {
        return new Events(element, type, handler);
    }


    export function listenGroup() {
        return new EventsGroup();
    }

    export function __$trigger(target: EventTarget, type: string, bubbles = true, cancelable = true) {
        if (typeof target[type] === 'function') target[type]();
        else {
            let e = document.createEvent('Events');
            e.initEvent(type, bubbles, cancelable);
            // 이미 진행중인 이벤트가 있다면 버블링 후에 동작하도록
            setTimeout(() => target.dispatchEvent(e), 0);
        }
    }

    export function __$custom(target: EventTarget, type: string, detail, bubbles = true, cancelable = true) {
        let e: CustomEvent = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        setTimeout(() => target.dispatchEvent(e), 0);
    }


    type WORK_HANDLERS = (val: string, target: HTMLElement, e: Event) => any
    type WORK_HANDLER = (key: string, val: string, target: HTMLElement, e: Event) => any

    export function __$eventWorks(element: EventTarget,
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
    let _camelcase = (function (reg) {
        return (attrName) => attrName.replace(reg, (char) => char[1].toUpperCase());
    })(/\-./g);


    export interface DATA_EVENT_DIRECTIVE<T> {
        [index: string]: (t: T) => any
    }


    interface EvtFactory<E, T> {
        new(e: E, eventTarget: HTMLElement): T & { init?() }
    }


    const DEFAULT_DIRECTIVE = {
        ele(element, attrValue, obj) {
            obj[attrValue || 'element'] = element;
        }
    }

    /*
     *
     * DOM 트리의 모든 어트리뷰트를 순회하며 데이터를 작성한다.
     */
    export function __$attrEvent<T>(element: Element, type: keyof DocumentEventMap, attr: string, directive: DATA_EVENT_DIRECTIVE<T>)
    export function __$attrEvent(element: Element, type: keyof DocumentEventMap, attr: string, directive)
    export function __$attrEvent<T, K extends keyof DocumentEventMap>(element: Element, type: K, attr: string,
                                                                      provider: EvtFactory<DocumentEventMap[K], T>,
                                                                      directive: DATA_EVENT_DIRECTIVE<T>)
    export function __$attrEvent(element, type, attr, provider, directive?) {

        // arguments : 4
        if (!directive) {
            directive = provider;
            provider = false;
        }

        if(directive['$init']) directive['$init']();

        return new Events(element, type, (e) => {
            let eventTarget,
                target = eventTarget = e.target,
                attrValue,
                dir;


            /*
             *  총 2번의 순회를 하게 되는 오버헤드가 존재한다.
             *
             */
            do {
                if (attrValue = eventTarget.getAttribute(attr)) {
                    dir = directive[attrValue];
                    break;
                }
            } while ((eventTarget = eventTarget.parentElement) && eventTarget !== element);


            if (dir) {


                let
                    obj = provider ? new provider(e, eventTarget) : {event: e},
                    limit = element,
                    done = {},
                    attrs: NamedNodeMap, l = 0,
                    isData,
                    att: Attr,
                    attrName;

                done[attr] = true;

                while (target) {

                    attrs = target.attributes;
                    l = attrs.length;

                    while (l-- > 0) {
                        att = attrs[l];
                        attrName = att.name;
                        isData = attrName.indexOf('data-') === 0;
                        attrName = isData ? _camelcase(attrName.slice(5)) : attrName;

                        if (!done[attrName]) {

                            attrName[0] !== '$' && (done[attrName] = true);

                            if (typeof obj[attrName] === 'function') {
                                obj[attrName].call(obj, target, att.value);
                            } else if (DEFAULT_DIRECTIVE[attrName]) {
                                DEFAULT_DIRECTIVE[attrName](target, att.value, obj);
                            } else if (isData) {
                                att.value && (obj[attrName] = __primitive(att.value));
                            }
                        }
                    }

                    if (target === limit) break;
                    target = target.parentElement;
                }

                dir.call(directive, obj);
            }
        });

    }


    /*
     *  click 이벤트에 의한 focus-in focus-out 토글 이벤트
     *
     */
    export let __$onFocus = (function () {

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

    export function __$simpleTrigger(target: HTMLElement, type: string, bubbles = true, cancelable = true, data?) {
        let e = document.createEvent('Event');
        e.initEvent(type, true, true);
        e['data'] = data;
        return target.dispatchEvent(e);
    }

}



