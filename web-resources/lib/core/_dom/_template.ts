// @2020-10-02
import {__parameters} from "../_metadata";
import {__newApply} from "../_util/newApply";
import {__findAll} from "./_selector";
import {Access} from "../_access";
import {__createHTML} from "./_commons";
import {Formats} from "../_format";


/*
 * @2020-10-05
 *
 */
export namespace Templates {

    import __read = Access.__read;
    import __datetime = Formats.__datetime;
    import __primitive = Access.__primitive;

    type Cons<T> = new (...arg) => T;
    type MapperHandler<T> = (ele: HTMLElement, data?) => T;

    export type MAPPER_FACTORY_HANDLER<T> = (data?) => T

    export interface TEMPLATE {
        apply(): this
    }

    export interface TEMPLATE_CONS<T extends TEMPLATE> {
        $create: (data?) => T

        new(...args): T
    }


    let DUMMY = {} as any,
        _DEFAULT_DIRECTIVE = {
            $class(ele: HTMLElement, bean, [obj]) {
                let {classList} = ele, p;
                for (p in obj) {
                    if (__read(obj[p], bean)) classList.add(p);
                    else classList.remove(p);
                }
            },
            $datetime(ele, bean, [prop, exp, p]) {
                if (bean = __read(bean, prop))
                    ele[p || 'textContent'] = __datetime(bean, exp);
            }
        },
        _DEFAULT_FILTER = {
            date: __datetime
        },

        r_filter = /[\?\|]/,
        ___filterApply = (str: string, obj) => {
            let [props, func, arg] = str.split(r_filter);
            obj = __read(props, obj);
            if (obj && _DEFAULT_FILTER[func]) return _DEFAULT_FILTER[func](obj, __primitive(arg));
            return obj || '';
        },

        ___parse = (str: string): any[] => {
            let i = str.indexOf('(');
            /*
             * data-access="'src : {img.src}':textContent"      :: '문자열{표현식}'
             * data-access="'{img.src}'"
             * data-access="name:src"           ==> name[src]
             * data-access="name"               ==> name[textContent]
             * data-access='name(1, "text")'    ==> bean.name(1, "text") / 괄호안의 내용은 JSON.parse([1, "text"])된다.
             *                                      bean에 name메서드가 없을 경우 기본 디렉티브에서 찾아본다.
             *
             * data-access='$class({"a-class": "name", "b-class": "prop.sub")'
             *                                  ==> !!name ? classList.add("a-class") : classList.remove("a-class")
             *
             * data-access="prop.sub?func|magic"
             *
             */
            //
            if (str[0] === "'") {
                i = str.indexOf("'", 1);
                return [1, str.slice(1, i), str.slice(i + 2) || 'textContent'];
            }
            if (i !== -1) {
                let fName = str.slice(0, i), args = str.slice(i + 1, -1);
                return [2, fName, args];
            }
            return (i = str.indexOf(':')) === -1 ?
                [0, str, 'textContent'] :
                [0, str.slice(0, i), str.slice(i + 1)];
        },

        ___getEle = (str: string | HTMLElement): HTMLElement => {

            let ele;
            if (typeof str !== 'string') ele = str;
            else if (str[0] === '<') ele = __createHTML(str, true);
            else if (str[0] === '=') ele = __createHTML(document.getElementById(str.slice(1)).innerText);
            else ele = document.querySelector(str);

            return ele
        }

    export let $TEMPLATE_KEY$ = '____TeMpLaTe____';
    export let $GET = (e: Element) => e ? e[$TEMPLATE_KEY$] || $GET(e.parentElement) : null ;

    function __apply0(target: HTMLElement, bean, command: string) {
        let [temp, exp, prop] = ___parse(command);

        switch (temp) {
            case 2 :
                if (temp = bean[exp]) temp.apply(bean, JSON.parse('[' + prop + ']'));
                else if (temp = _DEFAULT_DIRECTIVE[exp]) temp.call(null, target, bean, JSON.parse('[' + prop + ']'));
            case 1 :
                temp = exp.replace(/\{(.*?)\}/g, (_, dot) => ___filterApply(dot, bean));
                if (prop[0] === '[') target.setAttribute(prop.slice(1, -1), temp);
                else target[prop] = temp;
                return;
            case 0 :
                temp = ___filterApply(exp, bean);
                if (prop[0] === '[') target.setAttribute(prop.slice(1, -1), temp);
                else target[prop] = temp;
        }
    }

    // create Template Class
    // names = [functionName, args...]
    function __create0<T>(element: HTMLElement, cons: Cons<T>, names: [string, string[]], data?): T {

        data = data || DUMMY;

        let
            [functionName, _args] = names,
            args = _args.map(v => data[v] || null), r = [], ri = 0;

        __findAll(element, '[data-element]').forEach(e => {
            let key = e.getAttribute('data-element'),
                i = _args.indexOf(key || 'element');
            if (i !== -1 && !args[i]) {
                args[i] = e;
                r[ri++] = e;
            }
        });

        //
        // __values가 있으면 찾은 값을 모두 넣어준다.
        if ((ri = _args.indexOf('_elements')) !== -1) {
            args[ri] = r;
        }

        data = __newApply(cons, args);
        data[$TEMPLATE_KEY$] = element;
        element[$TEMPLATE_KEY$] = data;

        if (!element.hasAttribute('data-template'))
            element.setAttribute('data-template', functionName);

        return data;
    }

    /*
     * [data-template]가 있는 Element는 다른 객체가 관리하는 것으로 판단하고 넘긴다
     */
    function __templateApply0(ele: HTMLElement, bean) {
        let {children, children: {length: i}} = ele, e, v
        while (i-- > 0) {
            if (!children[i].hasAttribute('data-template')) {
                if (v = (e = children[i]).getAttribute('data-access')) {
                    __apply0(e, bean, v);
                }
                __templateApply(e, bean);
            }
        }
        return ele;
    }

    // data-access="표현식" 갱신
    export function __templateApply(ele: HTMLElement, bean = DUMMY) {
        let v = ele.getAttribute('data-access');
        if (v) __apply0(ele, bean, v);
        __templateApply0(ele, bean);
        return ele;
    }


    /*
     * 이 함수를 이용하는 가장 큰 목적은 : 생성 인자로 data-element가 마킹된 엘리먼트를 받고자 하는 것이다.
     * 하지만 이 함수를 직접 이용하는 것보다, @Template 메타를 쓰는 것을 강력히 권장한다.
     */
    export function __template<T>(element: HTMLElement, cons: Cons<T>): T
    export function __template<T>(element: HTMLElement, cons: Cons<T>, data: {}): T
    export function __template<T>(element: HTMLElement, cons: Cons<T>): T
    export function __template<T>(element: HTMLElement, cons: Cons<T>, data: {}): T
    export function __template(element: HTMLElement, cons, data?) {
        return __create0(element, cons, __parameters(cons), data);
    }


    export function __templateFactory<T>(ele: HTMLElement, cons: Cons<T>): MAPPER_FACTORY_HANDLER<T> {
        let names = __parameters(cons);
        ele = <HTMLElement>ele.cloneNode(true);
        return (data?) => __create0(<HTMLElement>ele.cloneNode(true), cons, names, data);
    }


    /*
     * data-template가 마킹된 엘리먼트들을 골라낸다.
     * ?로 시작하는 값은 부모 엘리먼트로부터 분리해낸다.
     * 스타일시트에 [data-template^="?"] { display: none; } 을 사용하는걸 권장한다.
     */
    export function __templateMap(ele: HTMLElement): { [index: string]: HTMLElement } {
        let r = {}, v;
        __findAll(ele, '[data-template]').forEach(e => {

            v = e.getAttribute('data-template');
            if (v[0] === '?') {
                e.parentElement.removeChild(e);
                e.setAttribute('data-template', v = v.slice(1))
            }
            r[v] = e;
        })
        return r;
    }

    /*
     * 2020-10-13
     *
     * @Template
     * 감회가 새롭다. 내가 만든 첫번째 프레임워크가 같은 이름, 같은 의도를 가진 로직이었다.
     * 한동안 정말 잘 써먹었고, 생산성을 크게 높여주었었다.
     * 하지만 캡슐화된 로직이 너무 많아, 어느 순간부터인가 불안해지기 시작했다.
     * (특히 종종 거대하고 복잡한 소스코드를 볼때마다 그 안에 뭔가 버그가 있을지도 모른다는 막연한 불안감도 있었다.)
     * 정말 잘만든 프레임워크였지만, 얼마후부터 나는 더 단순한 코드를 갈망하기 시작했다.
     * 그리고 몇년이 지나.. (의도하진 않았지만) 같은 이름의 프레임워크를 다시 만들게 되었다.
     * 그때보다 더욱 강력하면서도 단순하다. 캡슐화된 로직이 전혀 없으며, 예외성을 최소로 했다.
     *
     */
    export function Template<T extends TEMPLATE>(template: string | Element | (() => HTMLElement), clone = true) {

        return (cons: TEMPLATE_CONS<T>) => {

            let $ele: (() => HTMLElement) = typeof template === 'function' ? template : (function (ele) {
                    return clone ? () => ele.cloneNode(true) as any : () => ele;
                })(___getEle(template as any)),

                params = __parameters(cons),
                __apply = cons.prototype.apply;

            if (cons.$create)
                throw new Error('$create는 선언만 해놓아야 한다\n구현은 프레임워크에서 해준다');

            cons.$create = (data) => __create0($ele(), cons, params, data);
            cons.prototype.apply = function () {
                __apply.call(this);
                this[$TEMPLATE_KEY$] && __apply(this[$TEMPLATE_KEY$], this);
                return this;
            }
        }
    }

}

