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
    let r_read_split = /,\s*/,
        __setter = (obj, name, val) => obj[name] === void 0 && (obj[name] = val);

    function __builder(target: HTMLElement, obj) {

        let v: any;

        // target 자체를
        if ((v = target.getAttribute('data-element')) != null) {
            __setter(obj, v || 'element', target);
        }


        /*
         * ① data-value="name:this"
         *    obj[name] = <element>  (=: data-element="name")
         *
         * ② data-value="name:val"
         *    obj[name] = __primitive('텍스트')
         *
         * ③ data-value="name"
         *    obj[name] = __primitive(element.getAttribute('data-name'))
         *
         * ④ data-value="name:[attr]"
         *    obj[name] = __primitive(element.getAttribute('attr'))
         *
         */
        if ((v = target.getAttribute('data-value'))) {
            v.split(r_read_split).forEach(prop => {
                let [p, v] = prop.split(':');
                if (obj[p] === undefined) {
                    if (!v) obj[p] = __primitive(target.getAttribute('data-' + p));
                    else if (v === 'this') obj[p] = target;
                    else if (v[0] === '[')
                        obj[p] = __primitive(target.getAttribute(v.slice(1, v.length - 1)));
                    else obj[p] = __primitive(v);
                }
            });
        }

        // data-json='{"name":"johnson", "old":42}'
        // data-json='"name":"johnson", "old":42'
        if ((v = target.getAttribute('data-json'))) {
            if (v[0] !== '{') v = '{' + v + '}';
            v = JSON.parse(v);
            for (let p in v) obj[p] === undefined && (obj[p] = v[p]);
        }
        return obj;
    }

    export interface DATA_EVENT_OBJECT {
        event: Event
        target: HTMLElement
        eventKey: string
    }

    export interface DATA_EVENT_DIRECTIVE<T> {
        [index: string]: (t: T) => any

        $init?: (t: T) => any
    }

    export interface DATA_EVENT_OBJ_HANDLER<T> {
        (e: Event, eventKey: string): T
    }

    // DOM을 순회할때 직접 참여할 수 있는 인터셉터 핸들러
    export type DATA_EVENT_INTERCEPTOR<T> = (target: HTMLElement, obj: T, eventKey: string, e: Event) => any;

    function getObject() {
        return {}
    }

    /*
     *
     * ★★★ 첫번째 메서드에만 타입을 마킹하면, 그 뒤의 메서드들은 자동으로 타입체크가 된다.
     *
     * type VAL = DE_TYPE<{ name: number, ele: HTMLElement }>
     *
     * __dataEvent(..., {
     *      some(val: VAL) {    // <-- type marking!!
     *          val.name;   // ok!
     *          val.ele;    // ok!
     *      },
     *      some2(val) {
     *          val.name;   // ok!
     *          val.ele;    // ok!
     *      }
     *  });
     *
     *
     */
    export type DE_TYPE<T> = DATA_EVENT_OBJECT & T;
    export type DED_TYPE<T> = DATA_EVENT_DIRECTIVE<DE_TYPE<T>>;


    type DEM = keyof DocumentEventMap;


    /*
     * 2020-10-09
     * 타입유추를 최대한 사용하기 위한 인터페이스
     *
     * ① directive의 첫번째 메서드에 타입을 적용하면, 이하 나머지 메서드들의 인자는 자동으로 타입추론이 된다.
     * ② directive의 범용성을 높이기 위해 메서드 인자는 100% 커스텀하도록 만들었다. (원래는 이벤트객체를 포함하게 했었음)
     * ③ 인터페이스는 선언된 순서대로 우선권을 가진다. directive:any를 후반부에 넣어 타입형이 우선되도록 했다.
     *
     */
    export function __$dataEvent<T>(element: HTMLElement, type: keyof DocumentEventMap, attr: string,
                                    directive: DATA_EVENT_DIRECTIVE<T>)
    export function __$dataEvent(element: HTMLElement, type: keyof DocumentEventMap, attr: string, directive)
    export function __$dataEvent<T, K extends keyof DocumentEventMap>(element: HTMLElement, type: K, attr: string,
                                                                      provider: (eventTarget: HTMLElement, e: DocumentEventMap[K]) => T,
                                                                      directive: DATA_EVENT_DIRECTIVE<T>)
    export function __$dataEvent<T, K extends keyof DocumentEventMap>(element: HTMLElement, type: K, attr: string,
                                                                      provider: (eventTarget: HTMLElement, e: DocumentEventMap[K]) => T,
                                                                      directive)
    export function __$dataEvent(element, type, attr, provider, directive?) {

        // arguments : 4
        if (!directive) {
            directive = provider;
            provider = false;
        }

        return new Events(element, type, (e) => {
            let target = e.target,
                attrValue,
                dir;

            // 등록된 객체가 있는지 확인
            do {
                if (attrValue = target.getAttribute(attr)) {
                    dir = directive[attrValue];
                    break;
                }
            } while ((target = target.parentElement) && target !== element);

            if (dir) {
                let
                    obj = {event: e},
                    limit = element,
                    node = e.target;

                while (node && (limit !== node)) {
                    __builder(node, obj);
                    node = node.parentElement;
                }

                if (provider) obj = __extend(provider(target, e), obj);

                dir['$init'] && dir['$init'](obj);
                dir.call(directive, obj);
            }
        });
    }


    /*export function __$bubbleEvent(element: HTMLElement, type: string, attr: string, directive) {

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
                obj && __builder(target, obj);
                target = target.parentElement;
            } while (target && target !== element);

            if (obj) {
                directive['*'] && directive['*'](obj, e);
                handler.call(directive, obj, e);
            }
        });
    }*/

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



