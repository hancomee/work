

export function script(): { [index: string]: (a, b) => string } {
    let r = {}, c = document.head.getElementsByTagName('script'), l = c.length, i = 0,
        script: HTMLScriptElement

    for (; i < l; i++) {
        script = c[i];
        if(script.type === 'text/html')
            r[script.id] = script.innerText
    }

    return r;
}