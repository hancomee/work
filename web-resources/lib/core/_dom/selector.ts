import {_forEach} from "../_func/array";


function _func(prop: string, ele: Element, s: string, opt?, data?) {
    let type = typeof opt,
        list = ele[prop](s), l = list.length;

    if (type === 'number') return list[opt];

    let i = l, r = [];
    while (i-- > 0) r[i] = list[i];

    if (type === 'function') {
        i++;
        for (; i < l; i++)
            opt.call(ele, r[i], i, data);
        return data;
    }

    return r;
}


export function getElementById(id: string) {
    return <HTMLElement>document.getElementById(id);
}

export function querySelector(ele: Element, s: string) {
    return <HTMLElement>ele.querySelector(s);
}


export function querySelectorAll(ele: Element, s: string): HTMLElement[]
export function querySelectorAll<T>(ele: Element, s: string, handler: (e: HTMLElement, i: number, t: T) => any, data?: T): T
export function querySelectorAll(ele: Element, s: string, index: number): HTMLElement
export function querySelectorAll(ele: Element, s: string, opt?, data?) {
    return _func('querySelectorAll', ele, s, opt, data);
}


export function getElementsByClassName(ele: Element, s: string): HTMLElement[]
export function getElementsByClassName<T>(ele: Element, s: string, handler: (e: HTMLElement, i: number, t: T,) => any, data?: T): T
export function getElementsByClassName(ele: Element, s: string, index: number): HTMLElement
export function getElementsByClassName(ele: Element, s: string, opt?, data?) {
    return _func('getElementsByClassName', ele, s, opt, data);
}


export function getElementsByTagName(ele: Element, s: string): HTMLElement[]
export function getElementsByTagName<T>(ele: Element, s: string, handler: (e: HTMLElement, i: number, t: T,) => any, data?: T): T
export function getElementsByTagName(ele: Element, s: string, index: number): HTMLElement
export function getElementsByTagName(ele: Element, s: string, opt?, data?) {
    return _func('getElementsByTagName', ele, s, opt, data);
}


export function getElementsByAttr<T>(target: HTMLElement,
                                     attrName: string,
                                     handler: (r: T, e: HTMLElement, v: string, i: number) => any, r?: T): T
export function getElementsByAttr<R extends HTMLElement, T>(target: HTMLElement,
                                     attrName: string,
                                     directive: { [index: string]: (ele: R, target: HTMLElement, data: T) => void }, data?: T): R
export function getElementsByAttr(target, attrName, c, d?) {

    let i = 0,
        list = target.querySelectorAll('[' + attrName + ']'),
        l = list.length;

    if (l) {
        if (typeof c === 'function') {
            for (; i < l; i++)
                c(d, list[i], list[i].getAttribute(attrName), i);
            return d;
        }
        else {
            for (; i < l; i++)
                c[list[i].getAttribute(attrName)](list[i], target, d)
        }
    }

    return target;
}