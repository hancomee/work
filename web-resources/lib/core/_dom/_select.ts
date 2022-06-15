import {r_number} from "../_regexp/number";
import {__newApply} from "../_util/newApply";

// 정방향
function cEach(children: ArrayLike<Node>, n: number) {
    let l = children.length, i = 0, pos = 1;
    for (; i < l; i++) {
        if (children[i].nodeType === 1) {
            if (pos++ === n) return children[i];
        }
    }
    return null;
}

// 역방향
function cEachReverse(children: ArrayLike<Node>, n: number) {
    let l = children.length, pos = 1;
    while (l-- > 0) {
        if (children[l].nodeType === 1) {
            if (pos++ === n) return children[l];
        }
    }
    return null;
}


// nth-child(?) 찾기
/*
 *
 *  젓같은 ie에서는 fragment에 children이 없다. 따라서 childNodes로 한다..
 *  음수값을 넣으며녀 뒤에서부터 찾는다
 */
export function __nthChildren(context: Element, nth: number) {
    if (nth < 0) return cEachReverse(context.childNodes, nth * -1);
    else return cEach(context.childNodes, nth === 0 ? 1 : nth);
}


export function __selectMap<T>(obj: new(...args) => T, element: HTMLElement, selectors: string[] | string): T
export function __selectMap<T>(obj: T, element: HTMLElement, directive: Object): T
export function __selectMap(obj, element: HTMLElement, directive) {

    if (typeof obj === 'function') {
        return __newApply(obj, __selectA(element, directive));
    }

    for (let p in directive) {
        if (typeof directive[p] === 'string') {
            obj[p] = __select1(element, directive[p]);
        }
    }
    return obj;
}


function _lookup(str: string, e: number) {
    return parseInt(str.substring(str.lastIndexOf('[') + 1, e));
}


export function __select1(context, selector: string) {

    if (selector[0] === '#')
        return document.getElementById(selector.slice(1));

    let
        r, e, l = selector[e = (selector.length - 1)];

    switch (selector[0]) {
        case '(' :
            r = selector.substring(1, selector.lastIndexOf(')'));
            return l === ']' ? context.querySelectorAll(r) : context.querySelector(r);
        case '<' :
            r = selector.substring(1, selector.lastIndexOf('>'));
            r = context.getElementsByTagName(r);
            return l === '>' ? r : r[_lookup(selector, e)]
        case '.' :
            if (l === ']') {
                r = context.getElementsByClassName(selector.substring(1, selector.lastIndexOf('[')));
                return r[_lookup(selector, e)];
            } else return context.getElementsByClassName(selector.substring(1));
        default :
            return null;
    }
}

/*
 *   getElementById         #id
 *   getElementByClassName  .class[1], .classes
 *   getElementByTagName    <tag>[1], <tags>
 *   querySelector          (selector)
 *   querySelectorAll       (selector)[]
 */
export function __selectA(ele: Element, arg: any[] | string): HTMLElement[]
export function __selectA<T>(ele: Element, arg: any[] | string, handler: (...args: any[]) => T): T
export function __selectA(element: Element, arg, handler?) {

    if (typeof arg === 'string')
        arg = arg.split(/\s+/g);

    let
        args = [], index = 0, i = 0, l = arg.length, str;

    for (; i < l; i++) {
        str = arg[i];

        // (1) 문자열일 경우
        if (typeof str === 'string') {

            // /1: 일 경우 앞선 결과를 element 주체로 사용한다.
            if (str[0] === '{') {
                let i = str.indexOf('}');
                args[index++] = __select1(args[str.substring(1, i)], str.slice(i + 1))
            } else args[index++] = __select1(element, str);
        }
        // (2) 함수일 경우, 결과물을 그대로 보내준다..
        else if (typeof str === 'function')
            args[index++] = str(element, args);
        // (2) 문자열이 아닐 경우 그대로 결과값
        else {
            args[index++] = str;
        }
    }
    return handler ? handler.apply(element, args) : args;
};


/*
 *  어트리뷰트 이름앞에 !를 붙이면 detach도 수행한다.
 */
export function __attrMap(target: HTMLElement, attrName: string, names: string[]): HTMLElement[]
export function __attrMap(target: HTMLElement, attrName: string): { [index: string]: HTMLElement }
export function __attrMap(target: HTMLElement, attrName: string, names?) {

    const detach = attrName[0] === '!';

    if(detach) attrName = attrName.slice(1);

    let values = target.querySelectorAll('[' + attrName + ']'),
        l = values.length;

    if (names) {
        let r = [], s, i;
        while (l-- > 0) {
            if(detach) values[l].parentElement.removeChild(values[l]);
            s = values[l].getAttribute(attrName);
            i = names.indexOf(s);
            if (i !== -1) r[i] = values[l];
        }
        return r;
    } else {
        let map = {};
        while (l-- > 0) {
            if(detach) values[l].parentElement.removeChild(values[l]);
            map[values[l].getAttribute(attrName)] = values[l];
        }
        return map;
    }

}