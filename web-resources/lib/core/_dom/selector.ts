import {_forEach} from "../_func/array";


function _func(prop: string, ele: Element, s: string, opt?, data?) {
    let type = typeof opt,
        list = ele[prop](s), l = list.length;

    switch (type) {
        case 'number' :
            return list[opt];
        case 'function' :
            let i = 0;
            for (; i < l; i++)
                opt.call(ele, list[i], i, data);
            return data;
        default :
            let r = [];
            while (l-- > 0) r[l] = list[l];
            return r;
    }
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
export function getElementsByAttr(target: HTMLElement,
                                  attrName: string,
                                  directive: { [index: string]: (ele: HTMLElement, target: HTMLElement) => void })
export function getElementsByAttr(target, attrName, c, d?) {

    if (typeof c === 'function') {
        let i = 0;
        _forEach(target.querySelectorAll('[' + attrName + ']'), (e: HTMLElement) => {
            c(d, e, e.getAttribute(attrName), i++);
        });
        return d;
    }
    else {
        _forEach(target.querySelectorAll('[' + attrName + ']'), (e: HTMLElement) => {
            c[e.getAttribute(attrName)](e, target);
        });
    }

    return target;
}