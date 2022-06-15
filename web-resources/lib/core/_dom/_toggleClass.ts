export function __toggleClass(element: Element, names: string | string[], flag?: boolean) {
    let {classList} = element;

    if (typeof names === 'string')
        names = [names];

    if (arguments.length === 2) {
        names.forEach(v => {
            if (classList.contains(v)) classList.remove(v);
            else classList.add(v);
        })
    } else names.forEach(v => flag ? classList.add(v) : classList.remove(v));
    return element;
}

export function __toggleClasses(element: Element, add: string, remove: string) {
    let {classList} = element;
    classList.add(add);
    classList.remove(remove);
    return element;
}