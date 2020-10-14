let _r = /\s/;

function __search(str: string, pos: number, limit: number, endChar: string, array: string[], r = _r) {

    let i = 0,
        char;

    while (pos++ < limit) {
        char = str[pos];
        // 주석부분은 모두 제낀다
        if (char === '/') {
            if (str[pos + 1] === '/') pos = str.indexOf("\n", pos)
            else pos = str.indexOf('*/', pos) + 1;
        } else if (char === endChar) {
            return pos;
        } else if (!r.test(char)) {
            array[i++] = char;
        }
    }
}

/*
 * 파라메터 이름 배열을 돌려준다.
 * 이름이 없을수도 있다.
 */
export function __parameters(func: Function): [string, string[]] {
    let
        str = func.toString(),
        l = str.length,
        result = [], args = [];

    __search(str, __search(str, 8, l, '(', result), l, ')', args);

    return [result.join(''), args.length ? args.join('').split(',') : args];
}

