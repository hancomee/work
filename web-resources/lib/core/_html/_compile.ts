import {Access} from "../_access";
import access = Access.__access;
import {__indexOfChar} from "./_indexof";
import {Formats} from "../_format";
import __filterFunction = Formats.__filterFunction;
import __filterParser = Formats.__filterParser;
import __read = Access.__read;
import __filterApply = Formats.__filterApply;

let

    // "div>"  or "div class=...>"
    // 앞 <는 빼고 올린다.
    ___tagName = (html: string, pos: number) => {
        let i = pos;
        while (html[pos] !== ' ' && html[pos] !== '>' && html[pos] !== '/') pos++;
        return html.substring(i, pos);
    };


/*
 *
 *  엘리먼트의 헤더를 시작점으로 재귀 스택
 *
 */
function ____compile(html: string, filter,
                     idx = {val: 0}, // 전체 커서
                     stack_headline: string[] = [],
                     stack_name: string[] = [],
                     stack_index = 0
) {

    let pos = idx.val,  // 탐색에 사용될 커서
        i = idx.val,    // 태그의 시작 커서
        e: number,
        r = [],
        rIdx = 0,
        tag_name: string,

        handler = function (data) {
            let result = [];
            for (let i = 0; i < rIdx; i++)
                result[i] = r[i].call(this, data);
            return result.join('');
        };

    // ① 태그의 헤더가 들어온 경우.
    if (stack_index) {
        let line = stack_headline[stack_index - 1],
            s_cursor = line.indexOf(' _="');

        if (s_cursor !== -1) {
            let e_cursor = line.indexOf('"', s_cursor + 4),
                exp = line.substring(s_cursor + 4, e_cursor),   //  :="exp"  ==> exp
                _handler = handler;

            // 문자열은 없앤다.
            line = line.substring(0, s_cursor) + line.substring(e_cursor + 1);

            handler = function (data) {
                let val = access(data, exp);
                if (val != null) {
                    if (Array.isArray(val)) {
                        return val.map((v, i) => _handler.call((this.index = i, this), v)).join('');
                    } else return _handler.call(this, val);
                }
                return '';
            }
        }

        r[rIdx++] = __replaceHTML(line, filter);
    }


    /*
     * ② 태그 시작점을 찾는다
     * < >를 기준으로 전체 문자열을 순차적으로 검색한다.
     */
    while ((pos = html.indexOf('<', pos)) !== -1) {

        // 여는 태그를 찾는 동시에 닫는 태그를 찾는다
        e = __indexOfChar(html, '>', pos) + 1;

        // 1) 여는 태그일 경우
        if (html[pos + 1] !== '/') {

            // prefix string
            if (i !== pos) {
                r[rIdx++] = __replaceHTML(html.substring(i, pos));
            }

            stack_headline[stack_index] = html.substring(pos, e);
            tag_name = stack_name[stack_index] = ___tagName(html, pos + 1);

            // 하위 엘리먼트를 탐색하고 온다. idx.val은 진행된 커서를 가지고 오기 위함
            idx.val = e;
            r[rIdx++] = ____compile(html, filter, idx, stack_headline, stack_name, stack_index + 1);
            e = idx.val;
        }

        // 2) 닫는 태그 :: 재귀함수의 끝
        else {

            tag_name = html.substring(pos + 2, e - 1);

            stack_index--;

            // 현재 태그의 끝
            if (stack_name[stack_index] === tag_name) {
                r[rIdx++] = __replaceHTML(html.substring(i, e), filter);
                idx.val = e;    // 전체 커서를 변경한다.
            } else {
                idx.val = i;
            }

            return handler;
        }

        i = pos = e;

    }

    /*
     *   suffix string
     *   남은 문자열 : pos는 -1이 나올 수 있으므로 저장된 i를 쓴다
     *   여기는 document(문서 첫 함수스택)만 접근한다.
     */

    if (i < html.length) {
        r[rIdx++] = __replaceHTML(html.substring(i, html.length));
    }

    return handler;
}

export function __compileHTML(html: HTMLElement, filter?)
export function __compileHTML(html: string, filter?)
export function __compileHTML(html, filter?) {
    if (typeof html !== 'string') {
        html = html.outerHTML;
        if (html.parentElement)
            html.parentElement.removeChild(html);
    }
    let fn = ____compile(html, filter);
    return function (data, filter1 = filter) {
        return fn.call({}, data, filter1);
    }
}


/*
 *  단순히 문자열을 치환할때 쓴다.
 */
export function __replaceHTML(html: string, filter?) {

    let pos = html.indexOf('{{');
    if (pos === -1) return () => html;

    let r = [], rIdx = 0,
        c = 0, s = 0, e = 0, len = html.length;

    while ((s = html.indexOf('{{', c)) !== -1) {
        e = html.indexOf('}}', s);
        if (s !== c) r[rIdx++] = html.substring(c, s);
        r[rIdx++] = __filterFunction(html.substring(s + 2, e));
        c = e + 2;
    }

    if (c < len) r[rIdx++] = html.substring(c);

    return (data, d = filter) => {
        let rr = [];
        for (let i = 0; i < rIdx; i++) {
            rr[i] = typeof r[i] === 'string' ? r[i] : r[i](data, d);
        }
        return rr.join('');
    }
}


function ___replaceCommand(ele: HTMLElement, command, obj) {
    if (!command) return;

    let i = command.indexOf('?');
    if (i === -1) {
        let fn = __read(command, obj);
        if (typeof fn === 'function') fn.call(obj, ele);
        else if (fn) ele.textContent = fn;
    } else {
        ele.textContent = __filterApply(command, obj);
    }
}


export function __replaceCommand(ele: HTMLElement, obj, attr = 'data-command') {
    ___replaceCommand(ele, ele.getAttribute(attr), obj);
    let {children, children: {length}} = ele, i = 0;
    while (i < length) {
        if (children[i].nodeType === 1) __replaceCommand(<any>children[i], obj, attr);
        i++;
    }
}

