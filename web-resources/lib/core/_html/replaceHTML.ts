import {Access} from "../access";
import {Formats} from "../format";
import expValParse = Formats.expValParse;
import access = Access.access;

let directive = Formats.getDirective(),
    r_compile = / :([^>]*)>$/,

    // [create] ==> func(data, directive)
    __createFunction = (str: string) => {

        let [_prop, dir, opt] = expValParse(str),
            prop = (_prop[0] === '_' || _prop[0] === '$') ? _prop : '_.' + _prop,
            func = new Function('_', '$', 'return _ == null ? null : (' + prop + ');')

        return (data, directive, opData) => {
            let v = func(data, opData);

            if (directive[dir])
                v = directive[dir](v, opt);
            return v == null ? '' : v;
        }
    },

    // "div>"  or "div class=...>"
    // 앞 <는 빼고 올린다.
    __getTagName = (html: string, pos: number) => {
        let i = pos;
        while (html[pos] !== ' ' && html[pos] !== '>')
            pos++;
        return html.substring(i, pos);
    },

    // 태그 닫는 문자 찾기   attr="name > value" 등을 피해가기 위한 함수
    __findClose = (html: string, pos: number) => {
        let t;
        while ((t = html[pos++]) !== '>') {
            if (t === '"') pos = html.indexOf('"', pos) + 1;
        }
        return pos;
    };


function __replaceHTML(html: string, pos: number, limit: number) {

    let index = 0, func = [], fi = 0;

    do {
        // ...{{  사이에 문자열이 있으면
        if (index !== pos) {
            func[fi++] = html.substring(index, pos);
        }

        index = pos = pos + 2;              // 커서를 {{ 다음으로 옮긴다.
        pos = html.indexOf('}}', index);    // }}를 찾는다

        if (pos === -1) {
            throw new Error('표현식이 잘못되었습니다. 닫는 "}}" 문자열이 없습니다')
        }

        func[fi++] = __createFunction(html.substring(index, pos));

        index = pos + 2;

        pos = html.indexOf('{{', index);

    } while (pos !== -1 && index < limit);

    if (index < limit) {
        func[fi++] = html.substring(index, limit);
    }

    return (obj, dir?, opt?) => {

        if (dir == null) dir = directive;

        let i = 0, f = func, l = fi, r = [];
        for (; i < l; i++) {
            r[i] = typeof f[i] === 'string' ? f[i] : f[i](obj, dir, opt);
        }
        return r.join('');
    }
}

function __compile(html: string, idx = {val: 0}, lines: string[] = [], tagStack = [], index = 0) {

    let pos: number, i = pos = idx.val, e: number,
        r = [], rIdx = 0, tag: string,
        handler = (data) => {
            let result = [];
            for (let i = 0; i < rIdx; i++)
                result[i] = r[i](data);
            let d = result.join('');
            return d;
        };

    // ① 태그인 경우
    if (index) {
        let line = lines[index - 1],
            v = r_compile.exec(line);

        // expression이 있을 경우
        if (v) {
            let index = v.index, prop = v[1],
                _handler = handler;

            // 함수로 변경.  :="expression"
            if (prop[0] === '=') {
                let fn = new Function('_', 'return _ == null ? null : (' +
                    prop.substring(2, prop.length - 1) + ');');
                handler = (data) => {
                    if (fn(data)) return _handler(data);
                    return '';
                }
            }
            // 단순 변수.  :prop
            else {
                handler = (data) => {
                    let val = access(data, prop);
                    if (val != null) {
                        if (Array.isArray(val)) {
                            return val.map(v => _handler(v)).join('');
                        }
                        return _handler(val);
                    }
                    return '';
                }
            }


            // 정규식 부분은 지운다.
            line = line.substring(0, v.index) + line.substring(index + v[0].length - 1, line.length);

        }

        r[rIdx++] = _replaceHTML(line);
    }


    while ((pos = html.indexOf('<', pos)) !== -1) {

        e = __findClose(html, pos);

        // ① 여는 태그
        if (html[pos + 1] !== '/') {

            // prefix string
            if (i !== pos) {
                r[rIdx++] = _replaceHTML(html.substring(i, pos));
            }

            lines[index] = html.substring(pos, e);
            tag = tagStack[index] = __getTagName(html, pos + 1);

            idx.val = e;
            r[rIdx++] = __compile(html, idx, lines, tagStack, index + 1);
            e = idx.val;
        }

        // ② 닫는 태그
        else {
            tag = html.substring(pos + 2, e - 1);

            index--;

            // 현재 태그의 끝
            if (tagStack[index] === tag) {
                r[rIdx++] = _replaceHTML(html.substring(i, e));
                idx.val = e;
            }
            else {
                idx.val = i;
            }

            return handler
        }

        i = pos = e;

    }

    /*
     *   suffix string
     *   남은 문자열 : pos는 -1이 나올 수 있으므로 저장된 i를 쓴다
     *   여기는 document(문서 첫 함수스택)만 접근한다.
     */

    if (i < html.length) {
        r[rIdx++] = _replaceHTML(html.substring(i, html.length));
    }
    return handler
}


/*
 *  단순히 문자열을 치환할때 쓴다.
 */
export function _replaceHTML(html: string) {

    let pos = html.indexOf('{{');
    if (pos === -1) return () => html;
    return __replaceHTML(html, pos, html.length);

}


export function _compile(html) {
    return __compile(html);
}


