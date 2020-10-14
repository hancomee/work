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
export namespace Mappings {

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

    export let $TEMPLATE_KEY$ = '____template____';

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
                i = names.indexOf(key || 'element');
            if (i !== -1 && !args[i]) {
                args[i] = e;
                r[ri++] = e;
            }
        });

        // __values가 있으면 찾은 값을 모두 넣어준다.
        if ((ri = names.indexOf('__values')) !== -1) {
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
    function __accessApply0(ele: HTMLElement, bean) {
        let {children, children: {length: i}} = ele, e, v
        while (i-- > 0) {
            if (!children[i].hasAttribute('data-template')) {
                if (v = (e = children[i]).getAttribute('data-access')) {
                    __apply0(e, bean, v);
                }
                __accessApply(e, bean);
            }
        }
        return ele;
    }

    // data-access="표현식" 갱신
    export function __accessApply(ele: HTMLElement, bean = DUMMY) {
        let v = ele.getAttribute('data-access');
        if (v) __apply0(ele, bean, v);
        __accessApply0(ele, bean);
        return ele;
    }


    // 엘리먼트와 클래스 매핑
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

    // @Template
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

