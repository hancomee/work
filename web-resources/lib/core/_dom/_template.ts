// @2020-10-02
import {__parameters} from "../_metadata";
import {__newApply} from "../_util/newApply";
import {__findAll} from "./_selector";
import {Access} from "../_access";
import {__createHTML, __reduceFragment, __toggleClass} from "./_commons";
import {Formats} from "../_format";


/*
 * @2020-10-05
 *
 */
export namespace Templates {

    import __read = Access.__read;
    import __datetime = Formats.__datetime;
    import __filterApply = Formats.__filterApply;

    type Cons<T> = new (...arg) => T;
    type MapperHandler<T> = (ele: HTMLElement, data?) => T;

    export type $T<T> = (data?) => T

    export interface TEMPLATE {
        readonly element: HTMLElement

        apply(data?): this
    }


    export interface TEMPLATE_CONS<T extends TEMPLATE> {
        $create: (data?) => T

        new(element: HTMLElement, ...args): T
    }


    let DUMMY = {} as any,
        $$$tem = __templateMap(),


        _DEFAULT_DIRECTIVE = {
            $class(ele: HTMLElement, bean, [obj]) {
                let {classList} = ele, p;
                for (p in obj) {
                    if (__read(obj[p], bean)) classList.add(p);
                    else classList.remove(p);
                }
            },
            $toggle(ele: HTMLElement, bean, values) {
                __toggleClass(!!__read(values[2], bean), ele, values);
            },
            /*
             * 핵심 디렉티브
             * noClone
             */
            $template(ele: HTMLElement, bean, [prop, templateName, noClone]) {
                ele.textContent = '';

                if(typeof templateName !== 'string') {
                    noClone = templateName;
                    templateName = prop;
                    prop = null;
                }

                let data = __read(prop, bean),
                    template = $$$tem[templateName];

                if (data && template) {
                    let isArray = Array.isArray(data)
                    if (isArray) noClone = 0;
                    if (noClone === 2) {
                        ele['___*___'] = template = (ele['___*___'] || template.cloneNode(true));
                        noClone = 1;
                    }
                    data = isArray ? data : [data];

                    ele.appendChild(__reduceFragment(data, (v) =>
                        __templateApply(noClone ? template : template.cloneNode(true) as any, v)));
                }
            },
            $copy(ele: HTMLElement, bean, [templateName, noClone]) {
                ele.textContent = '';
                let t = $$$tem[templateName];
                if (t) {
                    if (!noClone) ele['___*___'] = t = (ele['___*___'] || t.cloneNode(true))
                    ele.appendChild(t);
                }
            },
        },
        _TEMPLATE_FILTER = {},

        r_func = /^[^\?]+\(/,
        r_prop = /:[^\)]+$/,
        q_map = ['"', "'"],
        ___parse = (str: string): any[] => {

            let i = q_map.indexOf(str[0]);
            /*
             * :access="'src : {img.src}':textContent"      :: '문자열{표현식}'
             * :access="'{img.src}'"
             * :access="name:src"           ==> name[src]
             * :access="name"               ==> name[textContent]
             * :access='name(1, "text")'    ==> bean.name(1, "text") / 괄호안의 내용은 JSON.parse([1, "text"])된다.
             *                                      bean에 name메서드가 없을 경우 기본 디렉티브에서 찾아본다.
             *
             * :access='$class({"a-class": "name", "b-class": "prop.sub")'
             *                                  ==> !!name ? classList.add("a-class") : classList.remove("a-class")
             *
             * :access="prop.sub?func|magic"
             *
             */
            //
            if (i !== -1) {
                i = str.lastIndexOf(q_map[i]);
                return [1, str.slice(1, i), str.slice(i + 2) || 'textContent'];
            }
            // 함수
            if (r_func.test(str)) {
                let fName = str.slice(0, i = str.indexOf('(')), args = str.slice(i + 1, -1);
                return [2, fName, args];
            }
            return r_prop.test(str) ?
                [0, str.slice(0, i = str.lastIndexOf(':')), str.slice(i + 1)] :
                [0, str, 'textContent'];
        },

        ___getEle = (str: string | HTMLElement): HTMLElement => {

            let ele;
            if (typeof str !== 'string') ele = str;
            else if (str[0] === '&') ele = $$$tem[str.slice(1)]
            else if (str[0] === '<') ele = __createHTML(str, true);
            else if (str[0] === '=') ele = __createHTML(document.getElementById(str.slice(1)).innerText);
            else ele = document.querySelector(str);

            if (!ele) throw new Error('@Template Error :: not exists template "' + str + '"');

            return ele;
        }

    export let $TEMPLATE_KEY$ = '____TeMpLaTe____';
    export let $GET = (e: Element) => e ? e[$TEMPLATE_KEY$] || $GET(e.parentElement) : null;
    export let $FILTER = (filter) => {
        for (let p in filter) _TEMPLATE_FILTER[p] = filter[p];
    }
    export let $TEMPLATE_MAP = $$$tem;

    function __apply0(target: HTMLElement, bean, command: string) {
        let [temp, exp, prop] = ___parse(command);

        switch (temp) {
            case 2 :
                if (temp = bean[exp]) temp.apply(bean, JSON.parse('[' + prop + ']'));
                else if (temp = _DEFAULT_DIRECTIVE[exp]) temp.call(null, target, bean, JSON.parse('[' + prop + ']'));
                return;
            case 1 :
                temp = exp.replace(/\{(.*?)\}/g, (_, str) => __filterApply(str, bean, _TEMPLATE_FILTER));
                if (prop[0] === '[') target.setAttribute(prop.slice(1, -1), temp);
                else target[prop] = temp;
                return;
            case 0 :
                temp = __filterApply(exp, bean, _TEMPLATE_FILTER);
                if (prop[0] === '[') target.setAttribute(prop.slice(1, -1), temp);
                else target[prop] = temp;
        }
    }

    // create Template Class
    // names = [functionName, args...]
    function __create0<T>(element: HTMLElement, cons: Cons<T>, names: [string, string[]], data?): T {

        data = data || DUMMY;
        data.element = element;

        let
            [functionName, _args] = names,
            args = _args.map(v => data[v]), r = [], ri = 0;

        __findAll(element, '[data-element]').forEach(e => {
            let key = e.getAttribute('data-element'),
                i = _args.indexOf(key || 'element');
            if (i !== -1 && !args[i]) {
                args[i] = e;
                r[ri++] = e;
            }
        });

        //
        // _elements 있으면 찾은 값을 모두 넣어준다.
        if ((ri = _args.indexOf('_elements')) !== -1) {
            args[ri] = r.slice(1);      // element는 빼고 넣어준다.
        }

        if (!element.hasAttribute(':template'))
            element.setAttribute(':template', functionName);

        data = __newApply(cons, args);
        element[$TEMPLATE_KEY$] = data;
        data[$TEMPLATE_KEY$] = element;

        return data;
    }

    /*
     * [:template]가 있는 Element는 다른 객체가 관리하는 것으로 판단하고 넘긴다
     */
    function __templateApply0(ele: HTMLElement, bean) {
        let {children, children: {length: i}} = ele, e, v
        while (i-- > 0) {
            if (!children[i].hasAttribute(':template')) {
                if (v = (e = children[i]).getAttribute(':access')) {
                    __apply0(e, bean, v);
                }
                __templateApply0(e, bean);
            }
        }
        return ele;
    }

    // :access="표현식" 갱신
    export function __templateApply(ele: HTMLElement, bean = DUMMY) {
        let v = ele.getAttribute(':access');
        if (v) __apply0(ele, bean, v);
        __templateApply0(ele, bean);
        return ele;
    }


    /*
     * :template가 마킹된 엘리먼트들을 골라낸다.
     * ?로 시작하는 값은 부모 엘리먼트로부터 분리해낸다.
     * 스타일시트에 [:template^="?"] { display: none; } 을 사용하는걸 권장한다.
     */
    function __templateMap(ele: HTMLElement | string = document.body): { [index: string]: HTMLElement } {
        let r = {}, v;

        __findAll(typeof ele === 'string' ? document.getElementById(ele) : ele, '[\\:template]').forEach(e => {

            v = e.getAttribute(':template');
            if (v[0] === '?') {
                e.parentElement.removeChild(e);
                e.setAttribute(':template', v = v.slice(1))
            }
            r[v] = e;
        })
        return r;
    }


    export function __templateFactory(ele: HTMLElement): (data?) => HTMLElement {
        ele = ele.cloneNode(true) as HTMLElement;
        return (data?) => {
            ele[$TEMPLATE_KEY$] = data;
            return __templateApply(ele, data);
        };
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
                __apply__ = cons.prototype.apply;

            if (cons.$create)
                throw new Error('$create는 선언만 해놓아야 한다\n구현은 프레임워크에서 해준다');

            cons.$create = (data) => __create0($ele(), cons, params, data);
            cons.prototype.apply = function () {
                let v = __apply__.apply(this, arguments);
                __templateApply(this.element, this);
                return v;
            }

            // read only element
            Object.defineProperty(cons.prototype, 'element', {
                get: function () {
                    return this[$TEMPLATE_KEY$];
                },
                set: function (v) {
                    this[$TEMPLATE_KEY$] || (this[$TEMPLATE_KEY$] = v);
                },
                configurable: false,
                enumerable: true
            });
        }
    }

}

