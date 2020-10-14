export function __orders(s: string, type: boolean): string
export function __orders(s: string): [string, string]
export function __orders(s: string, type?) {

    if (typeof type === 'boolean') {
        return type ? s : '<' + s;
    }
    if (s[0] === '<') {
        return ['desc', s.slice(1)];
    }
    else if (s[0] === '>') {
        s = s.slice(1);
    }
    return ['asc', s];

}