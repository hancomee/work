

// "..." 안의 문자는 제외한 상태에서 char를 찾는다.
// HTML 문법상 "" 안에는 "는 절대 들어갈 수 없다.
export function indexOfChar(str: string, char: string, i = 0) {
    let quit = false, l = str.length;
    for (; i < l; i++) {
        if(!quit && str[i] === char) return i;
        if(str[i] === '"') quit = !quit;
    }
    return -1;
}

export function lastIndexOfChar(str: string, char: string, i = str.length) {
    let quit = false, l = -1;
    for (; i > l; i--) {
        if(!quit && str[i] === char) return i;
        if(str[i] === '"') quit = !quit;
    }
    return -1;
}