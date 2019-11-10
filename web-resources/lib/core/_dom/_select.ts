import {r_number} from "../_regexp/number";

// 정방향
function cEach(children: ArrayLike<Node>, n: number) {
    let l = children.length, i = 0, pos = 1;
    for (; i < l; i++) {
        if (children[i].nodeType === 1) {
            if (pos++ === n) return children[i];
        }
    }
    return null;
}

// 역방향
function cEachReverse(children: ArrayLike<Node>, n: number) {
    let l = children.length, pos = 1;
    while (l-- > 0) {
        if (children[l].nodeType === 1) {
            if (pos++ === n) return children[l];
        }
    }
    return null;
}


// nth-child(?) 찾기
/*
 *
 *  젓같은 ie에서는 fragment에 children이 없다. 따라서 childNodes로 한다..
 */
export function nthChildren(context: Element, nth: number) {
    if (nth < 0) return cEachReverse(context.childNodes, nth * -1);
    else return cEach(context.childNodes, nth === 0 ? 1 : nth);
}


/*
 *   :0 첫번째 자식
 *   :-1 마지막 자식
 *   :* 모든 자식
 *
 *   =  querySelector
 *   [1] querySelectorAll
 *   "1"  getElementsByClassName
 *   <2> getElementsById
 */
function lookup(r: any[], index: number) {
    if (index < 0) {
        let l = r.length;
        index *= -1;
        index = index % l;
        return index === 0 ? r[0] : r[l - index];
    }
    return r[index];
}

export function selectMap<T>(obj: T, element: HTMLElement, directive): T {
    for(let p in directive) {
        if(typeof directive[p] === 'string')
            obj[p] = select(element, directive[p]);
    }
    return obj;
}




export function select(context, selector: string) {

    if(selector[0] === '#')
        return document.getElementById(selector.slice(1));

    let
        i = selector.indexOf('='), l = selector.lastIndexOf('"'),
        key = selector.substring(0, i),
        value = selector.substring(i + 2, l),
        r;

    switch (key) {
        case 'sel' :
            return context.querySelector(value);
        case 'class' :
            r = context.getElementsByClassName(value);
            return selector[l + 1] === '[' ? lookup(r, parseInt(selector.substring(l + 2, selector.length - 1))) : r;
        case 'tag' :
            r = context.getElementsByTagName(value);
            return selector[l + 1] === '[' ? lookup(r, parseInt(selector.substring(l + 2, selector.length - 1))) : r;
        case 'all' :
            r = context.querySelectorAll(value);
            return selector[l + 1] === '[' ? lookup(r, parseInt(selector.substring(l + 2, selector.length - 1))) : r;
    }

}


export function selectAll(ele: Element, arg: any[]): HTMLElement[]
export function selectAll<T>(ele: Element, arg: any[], handler: (...args: any[]) => T): T
export function selectAll(element: Element, arg, handler?) {
    let
        args = [], index = 0, i = 0, l = arg.length, str;

    for (; i < l; i++) {
        str = arg[i];

        // (1) 문자열일 경우
        if (typeof str === 'string') {

            // :1 일 경우 앞선 결과를 element 주체로 사용한다.
            if (str[0] === ':') {
                let i = str.indexOf(' ');
                args[index++] = select(args[str.substring(1, i)], str.slice(i + 1))
            }
            else args[index++] = select(element, str);
        }
        // (2) 함수일 경우, 결과물을 그대로 보내준다..
        else if (typeof str === 'function')
            args[index++] = str(element, args);
        // (2) 문자열이 아닐 경우 그대로 결과값
        else {
            args[index++] = str;
        }
    }
    return handler ? handler.apply(element, args) : args;
};