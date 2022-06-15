let {slice} = Array.prototype;

function __handler(element: HTMLElement, handler) {
    let {attributes: attrs} = element, l = attrs.length, i = 0,
        attr: Attr, fn;
    for (; i < l; i++) {
        attr = attrs[i];
        if (typeof (fn = handler[attr.name]) === 'function') {
            fn.call(handler, element, attr.value);
        }
    }
}


export function __attrRender(element: HTMLElement, handler) {

    __handler(element, handler);

    let children = <HTMLElement[]>slice.call(element.children),
        l = children.length, i = 0;

    for (; i < l; i++) {
        __attrRender(children[i], handler);
    }
}