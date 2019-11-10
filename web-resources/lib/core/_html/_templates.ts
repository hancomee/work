export function script(): { [index: string]: (a, b) => string } {
    let r = {}, c = document.head.getElementsByTagName('script'), l = c.length, i = 0,
        script: HTMLScriptElement

    for (; i < l; i++) {
        script = c[i];
        if (script.type === 'text/html')
            r[script.id] = script.innerText
    }

    return r;
}

export function outerHTML(ele: HTMLElement): HTMLElement[] {
    let array = [],
        div = document.createElement('div'),
        childs, i = 0, len: number, child,
        html = ele.outerText;

    div.innerHTML = html;
    childs = div.children;
    len = childs.length;

    for (; i < len; i++) {
        child = childs[i];
        if(child.nodeType === 1)
            array.push(child);
    }

    return array;
}