import {Arrays} from "../_array";
import __makeArray = Arrays.__makeArray;


export function __findById(id: string): HTMLElement {
    return document.getElementById(id);
}

export function __find(s: string): HTMLElement
export function __find(ele: Element | Document, s: string): HTMLElement
export function __find(ele, s?) {
    if (typeof ele === 'string') {
        s = ele;
        ele = document;
    }
    return <HTMLElement>ele.querySelector(s);
}

export function querySelectorCut(s: string)
export function querySelectorCut(ele: Element | Document, s: string)
export function querySelectorCut(ele, s?) {
    if (typeof ele === 'string') {
        s = ele;
        ele = document;
    }
    let d = <HTMLElement>ele.querySelector(s);
    if (d) d.parentElement.removeChild(d);
    return d;
}

/*
 * querySelectorAll과 다르게 element 자신도 셀렉팅 대상에 포함한다.
 */
export function __findAll(s: string): HTMLElement[]
export function __findAll(ele: Element | Document, s: string): HTMLElement[]
export function __findAll(ele, s?) {
    if (typeof ele === 'string') {
        s = ele;
        ele = document;
    } else if (ele.matches(s))
        return [ele].concat(__makeArray(ele.querySelectorAll(s)));

    return __makeArray(ele.querySelectorAll(s));
}


export function __findByClass(s: string): HTMLElement[]
export function __findByClass(s: string, index: number): HTMLElement
export function __findByClass(ele: Element | Document, s: string): HTMLElement[]
export function __findByClass(ele: Element | Document, s: string, index: number): HTMLElement
export function __findByClass(ele, s?, idx?) {
    if (typeof ele === 'string') {
        idx = s;
        s = ele;
        ele = document;
    }
    let result = ele.getElementsByClassName(s);
    return idx == null ? __makeArray(result) : result[idx < 0 ? result.length + idx : idx];
}

interface NameMap extends HTMLElementTagNameMap {
    "main": HTMLElement
}

export function __findByTag<K extends keyof NameMap>(s: K): NameMap[K][]
export function __findByTag<K extends keyof NameMap>(s: K, index: number): NameMap[K]
export function __findByTag<K extends keyof NameMap>(ele: Element | Document, s: K): NameMap[K][]
export function __findByTag<K extends keyof NameMap>(ele: Element | Document, s: K, index: number): NameMap[K]
export function __findByTag(ele, s?, idx?) {

    if (typeof ele === 'string') {
        idx = s;
        s = ele;
        ele = document;
    }
    let result = ele.getElementsByTagName(s);
    return idx == null ? __makeArray(result) : result[idx < 0 ? result.length + idx : idx];
}


export function
getElementsByAttr(target: HTMLElement | Document, attrName: string): { [index: string]: HTMLElement }
export function getElementsByAttr<T>(target: HTMLElement | Document,
                                     attrName: string,
                                     handler: (r: T, e: HTMLElement, v: string, i: number) => any, r?: T): T
export function getElementsByAttr<R extends HTMLElement, T>(target: HTMLElement | Document,
                                                            attrName: string,
                                                            directive: { [index: string]: (ele: R, target: HTMLElement, data: T) => void }, data?: T): R
export function getElementsByAttr(target, attrName, c?, d?) {

    let i = 0,
        list = target.querySelectorAll('[' + attrName + ']'),
        l = list.length;

    if (l) {
        if (!c) {
            let r = {};
            for (; i < l; i++)
                r[list[i].getAttribute(attrName)] = list[i];
            return r;
        }
        if (typeof c === 'function') {
            for (; i < l; i++)
                c(d, list[i], list[i].getAttribute(attrName), i);
            return d;
        } else {
            for (; i < l; i++)
                c[list[i].getAttribute(attrName)](list[i], target, d)
        }
    }

    return target;
}

export function __findChilds(ele: Node): HTMLElement[] {
    let r = [], {childNodes} = ele, l = childNodes.length, i = 0, pos = 0;

    for (; i < l; i++)
        if (childNodes[i].nodeType === 1)
            r[pos++] = childNodes[i];

    return r;
}