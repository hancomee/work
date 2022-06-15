const {every} = Array.prototype;

export function __hasClass(ele: Element, names: string | string[]) {
    let {classList} = ele;
    if (!Array.isArray(names)) names = [names];
    return every.call(names, (name) => classList.contains(name));
}