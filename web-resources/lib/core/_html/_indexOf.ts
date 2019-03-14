// "..." 안의 문자는 제외한 상태에서 char를 찾는다.
// HTML 문법상 "" 안에는 "는 절대 들어갈 수 없다.
export function indexOfChar(str: string, char: string, i = 0) {
    let l = str.length;
    for (; i < l; i++) {
        if (str[i] === char) return i;
        if (str[i] === '"') i = str.indexOf('"', i + 1) + 1;
    }
    return -1;
}

export function lastIndexOfChar(str: string, char: string, i = str.length) {
    let l = -1;
    for (; i > l; i--) {
        if (str[i] === char) return i;
        if (str[i] === '"') i = str.lastIndexOf('"', i) - 1;
    }
    return -1;
}