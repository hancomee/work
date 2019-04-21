function _func(prop: string, ele: Element | Document, s: string, opt?, data?) {

    if (typeof ele === 'string') {
        opt = s;
        s = ele;
        ele = document;
    }


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

export function getElementById(id: string): HTMLElement {
    return document.getElementById(id);
}

export function querySelector(s: string): HTMLElement
export function querySelector(ele: Element | Document, s: string): HTMLElement
export function querySelector(ele, s?) {
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


export function querySelectorAll(s: string): HTMLElement[]
export function querySelectorAll(s: string, index: number): HTMLElement
export function querySelectorAll(ele: Element | Document, s: string): HTMLElement[]
export function querySelectorAll(ele: Element | Document, s: string, index: number): HTMLElement
export function querySelectorAll<T>(ele: Element | Document, s: string, handler: (e: HTMLElement, i: number, t: T) => any, data?: T): T
export function querySelectorAll(ele, s?, opt?, data?) {
    return _func('querySelectorAll', ele, s, opt, data);
}


export function getElementsByClassName(s: string): HTMLElement[]
export function getElementsByClassName(s: string, index: number): HTMLElement
export function getElementsByClassName(ele: Element | Document, s: string): HTMLElement[]
export function getElementsByClassName(ele: Element | Document, s: string, index: number): HTMLElement
export function getElementsByClassName<T>(ele: Element | Document, s: string, handler: (e: HTMLElement, i: number, t: T,) => any, data?: T): T
export function getElementsByClassName(ele, s?, opt?, data?) {
    return _func('getElementsByClassName', ele, s, opt, data);
}



export function getElementsByTagName<K extends keyof TagNameMap>(s: K): TagNameMap[K][]
export function getElementsByTagName<K extends keyof TagNameMap>(s: K, index: number): TagNameMap[K]
export function getElementsByTagName<K extends keyof TagNameMap>(ele: Element | Document, s: K): TagNameMap[K][]
export function getElementsByTagName<K extends keyof TagNameMap>(ele: Element | Document, s: K, index: number): TagNameMap[K]
export function getElementsByTagName<K extends keyof TagNameMap, T>(ele: Element | Document, s: K, handler: (e: TagNameMap[K], i: number, t: T,) => any, data?: T): T
export function getElementsByTagName(ele, s?, opt?, data?) {
    return _func('getElementsByTagName', ele, s, opt, data);
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
        }
        else {
            for (; i < l; i++)
                c[list[i].getAttribute(attrName)](list[i], target, d)
        }
    }

    return target;
}

export function getElementChilds(ele: Node): HTMLElement[] {
    let r = [], {childNodes} = ele, l = childNodes.length, i = 0, pos = 0;

    for (; i < l; i++)
        if (childNodes[i].nodeType === 1)
            r[pos++] = childNodes[i];

    return r;
}