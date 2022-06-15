// @2020-10-02
import {__parameters} from "../_metadata";
import {__newApply} from "../_util/newApply";
import {Access} from "../_access";
import {__createHTML, __reduceFragment} from "./_commons";
import {Formats} from "../_format";
import {__toggleClass} from "./_toggleClass";
import __read = Access.__read;
import __filterApply = Formats.__filterApply;

type Cons<T> = new (...arg) => T;

export interface TEMPLATE {
    readonly element: HTMLElement

    apply(data?): this
}


export interface TEMPLATE_CONS<T extends TEMPLATE> {
    $create: (data?) => T

    /*
     * apply() 이후 엘리먼트 순회때
     */
    $directive?: {
        [index: string]: (ele: HTMLElement, bean: T, args: []) => void
    }

    new(element: HTMLElement, ...args): T
}


// 인풋 자동완성 등 제거
((eles: NodeListOf<HTMLInputElement>) => {
    let i = eles.length;
    while (i-- > 0) {
        eles[i].autocomplete = eles[i].autocapitalize = 'off';
        eles[i].spellcheck = false;
    }
})(document.querySelectorAll('[name]'));


const

    {forEach} = Array.prototype,

    DUMMY = {} as any,
    $TEMPLATE_KEY$ = '____TeMpLaTe____',

    _TEMPLATE_FILTER = {},

    /*
     * :template가 마킹된 엘리먼트들을 골라낸다.
     * ?로 시작하는 값은 부모 엘리먼트로부터 분리해낸다.
     */
    TEMPLATE_MAP = (function (r) {

        forEach.call(document.body.querySelectorAll('[_template]'), e => {
            let v = e.getAttribute('_template');
            if (v) {
                if (v[0] === '?') {
                    e.parentElement.removeChild(e);
                    e.setAttribute('_template', v = v.slice(1))
                }
                r[v] = e;
            }
        })
        return r;
    })({}),


    DEFAULT_DIRECTIVE = {
        $class(ele: HTMLElement, bean, [obj]) {
            let {classList} = ele, p;
            for (p in obj) {
                if (__read(obj[p], bean)) classList.add(p);
                else classList.remove(p);
            }
        },
        /*
         *  Template를 동적으로 생성해서 childElement로 등록
         *  noClone
         *     0 : apply때마다 새로 생성
         *     1 : 이미 있는 템플릿을 재사용
         *     2 : 맨처음 불려질때만 한번 생성한 후 계속 재사용
         *
         */
        $template(ele: HTMLElement, bean, [prop, templateName, noClone]) {
            ele.textContent = '';

            if (typeof templateName !== 'string') {
                noClone = templateName;
                templateName = prop;
                prop = null;
            }

            let data = __read(prop, bean),
                template = TEMPLATE_MAP[templateName];

            if (data && template) {
                let isArray = Array.isArray(data)
                if (isArray) noClone = 0;
                if (noClone === 2) {
                    ele['___*___'] = template = (ele['___*___'] || template.cloneNode(true));
                    noClone = 1;
                }
                data = isArray ? data : [data];

                ele.appendChild(__reduceFragment(data, (v) =>
                {
                    return __apply(noClone ? template : (template.cloneNode(true)) as any, v)
                }));
            }
        },
        $copy(ele: HTMLElement, bean, [templateName, noClone]) {
            ele.textContent = '';
            let t = TEMPLATE_MAP[templateName];
            if (t) {
                if (!noClone) ele['___*___'] = t = (ele['___*___'] || t.cloneNode(true))
                ele.appendChild(t);
            }
        },
    },

    __template = (str: string | HTMLElement): HTMLElement => {

        let ele;
        if (typeof str !== 'string') ele = str;
        else if (str[0] === '&') ele = TEMPLATE_MAP[str.slice(1)]
        else if (str[0] === '<') ele = __createHTML(str, true);
        else if (str[0] === '=') ele = __createHTML(document.getElementById(str.slice(1)).innerText);
        else ele = document.querySelector(str);

        if (!ele) throw new Error('@Template Error :: not exists template "' + str + '"');

        return ele;
    },

    __access = (function () {

        let

            r_split = /;\s*/,
            r_func = /^[^\?]+\(/,
            r_prop = /:[^\)]+$/,
            replace_prop = /\{(.*?)\}/g,
            q_map = ['"', "'"],

            __accessParse = (str: string): any[] => {

                let i = q_map.indexOf(str[0]);
                /*
                 * :access="'src : {img.src}':textContent"      :: '문자열{표현식}'
                 * :access="'{img.src} safd asdf {img.href}'"
                 * :access="name:src"           ==> name[src]
                 * :access="name"               ==> name[textContent]
                 * :access='name(1, "text")'    ==> bean.name(1, "text") / 괄호안의 내용은 JSON.parse([1, "text"])된다.
                 *                                      bean에 name메서드가 없을 경우 기본 디렉티브에서 찾아본다.
                 *
                 * :access='$class({"a-class": "name", "b-class": "prop.sub")'
                 *                                  ==> !!name ? classList.add("a-class") : classList.remove("a-class")
                 *
                 * :access='prop.sub?func("args", 10)'
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

            __accessApply = (target: HTMLElement, bean, command: string) => {


                let [temp, exp, prop] = __accessParse(command);

                switch (temp) {
                    // 함수일때
                    case 2 :
                        if (temp = bean[exp]) temp.apply(bean, JSON.parse('[' + prop + ']'));
                        else if (temp = DEFAULT_DIRECTIVE[exp]) temp.call(null, target, bean, JSON.parse('[' + prop + ']'));
                        return;
                    case 1 :
                        temp = exp.replace(replace_prop, (_, str) => __filterApply(str, bean, _TEMPLATE_FILTER));
                        if (prop[0] === '[') target.setAttribute(prop.slice(1, -1), temp);
                        else target[prop] = temp;
                        return;
                    case 0 :
                        temp = __filterApply(exp, bean, _TEMPLATE_FILTER);
                        if (prop[0] === '[') target.setAttribute(prop.slice(1, -1), temp);
                        else target[prop] = temp;
                }
            };

        return (target: HTMLElement, bean, command: string) => {
            command.split(r_split).forEach(v => __accessApply(target, bean, v));
        }
    })(),


    __apply = (function () {

        function $$(ele: HTMLElement, bean) {

            let {children, children: {length: i}} = ele, e, v

            while (i-- > 0) {

                /*
                 * 1) Template.$create()
                 *    apply() 호출시 해당 [_template] 객체만 렌더링해야 한다.
                 *
                 * 2) Template.apply(e, bean)
                 *    [_template]를 만나면 데이터를 참조해 element를 생성한다.
                 *
                 * 
                 *  isTemplate값은 위 2가지 경우를 구분하는 플래그
                 *
                 */
                e = children[i];

                // 2022-05-29
                if(e.hasAttribute('_template')) continue;

                /*if (e.hasAttribute('_template')) {

                    // Template.apply 호출
                    if(!e[$TEMPLATE_KEY$]) {
                        const value = __read(e.getAttribute('_template'), bean),
                            fragment = document.createDocumentFragment();

                        if (Array.isArray(value))
                            value.forEach(v => fragment.appendChild($$(e.cloneNode(true), v)))
                        else
                            fragment.appendChild($$(e.cloneNode(true), value));

                        ele.replaceChild(fragment, e);
                    }
                    
                    continue;
                }*/

                if (v = e.getAttribute('_access')) {
                    __access(e, bean, v);
                }

                e.hasAttribute('_ignore') || $$(e, bean);
            }
            return ele;
        }

        return (ele: HTMLElement, bean) => {
            let v = ele.getAttribute('_access');
            if (v) __access(ele, bean, v);
            $$(ele, bean);
            return ele;
        }

    })(),


    // create Template Class
    // names = [functionName, args...]
    __create = <T>(element: HTMLElement, cons: Cons<T>, names: [string, string[]], data?): T => {

        data = data || DUMMY;
        data.element = element;

        let
            [functionName, _args] = names,
            args = _args.map(v => data[v]);

        forEach.call(element.querySelectorAll('[_element]'), e => {
            let key = e.getAttribute('_element'),
                i = _args.indexOf(key);
            if (i !== -1 && !args[i]) {
                args[i] = e;
            }
        });


        if (!element.hasAttribute('_template'))
            element.setAttribute('_template', functionName);

        element[$TEMPLATE_KEY$] = data = __newApply(cons, args);
        data[$TEMPLATE_KEY$] = element;

        return data;
    };

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
            })(__template(template as any)),

            params = __parameters(cons),
            __apply__ = cons.prototype.apply;

        if (cons.$create)
            throw new Error('$create는 선언만 해놓아야 한다\n구현은 프레임워크에서 해준다');

        cons.$create = (data) => __create($ele(), cons, params, data);
        cons.prototype.apply = function () {
            let v = __apply__.apply(this, arguments);
            __apply(this.element, this);
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

/*
 * @2020-10-05
 *
 */
export namespace Template {

    //export let $TEMPLATE_MAP = $$$tem;

    const $data = {};

    export function data<T>(key: string): T
    export function data(key: string, val: any)
    export function data(key, val?) {
        if (val) $data[key] = val;
        else return $data[key];
    }

    export let get = (e: Element) => e ? e[$TEMPLATE_KEY$] || get(e.parentElement) : null;

    export let addFilter = (filter) => {
        for (let p in filter) _TEMPLATE_FILTER[p] = filter[p];
    }

    export function apply(element: HTMLElement, data) {
        return __apply(element, data);
    }
}

