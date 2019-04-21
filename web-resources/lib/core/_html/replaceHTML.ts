import {Access} from "../access";
import {Formats} from "../format";
import expValParse = Formats.expValParse;
import access = Access.access;
import {indexOfChar} from "./_indexOf";

let
    directive = Formats.getDirective(),
    ___createFunction = (exp) => new Function('_', '$', 'return _ == null ? null : (' + exp + ');'),
    __createFunction = (str: string) => {

        let [_prop, dir, opt] = expValParse(str),
            prop = _prop[0] !== '_' && _prop[0] !== '$' && _prop.indexOf(' ') === -1 && _prop.indexOf('.') === -1
                ? '_.' + _prop : _prop,
            func = ___createFunction(prop);

        return function (data, opData, directive) {
            let v = func.call(this, data, opData);

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

    __parse = (str: string) => {

        let l = str.length,
            pos = indexOfChar(str, ':');

        if (pos !== -1) {

            pos--;

            // ① :="..."
            if (str[pos + 2] === '=') {
                if (str[pos + 3] === '"') {
                    let d = str.lastIndexOf('"');
                    return [str.substring(0, pos) + str.substring(d + 1, l), '=',
                        str.substring(pos + 4, d)]
                }
            }

            // ② ::prop
            else if (str[pos + 2] === ':') {
                let i = pos + 3;
                while (str[i] !== '/' && str[i++] !== '>') ;

                return [str.substring(0, pos) + str.substring(i - 1, l), '::',
                    str.substring(pos + 3, i - 1)]
            }

            // ③ :prop>   :prop/>   공백이 없어야 함
            else if (str.indexOf(' ', pos + 2) === -1) {
                let i = pos + 2;
                while (str[i] !== '/' && str[i++] !== '>') ;
                return [str.substring(0, pos) + str.substring(i - 1, l), ':',
                    str.substring(pos + 2, i - 1)]
            }
        }

        return [str, ''];
    }


function __replaceHTML(html: string, pos: number, limit: number, directive) {

    let index = 0, func = [], fi = 0;

    do {
        // ...{{  사이에 문자열이 있으면
        if (index !== pos) {
            func[fi++] = html.substring(index, pos);
        }

        index = pos = pos + 2;              // 커서를 {{ 다음으로 옮긴다.
        pos = html.indexOf('}}', index);    // }}를 찾는다

        if (pos === -1) {
            throw new Error('표현식이 잘못되었습니다. 닫는 "}}" 문자열이 없습니다' + '\n' + html)
        }

        func[fi++] = __createFunction(html.substring(index, pos));

        index = pos + 2;

        pos = html.indexOf('{{', index);

    } while (pos !== -1 && index < limit);

    if (index < limit) {
        func[fi++] = html.substring(index, limit);
    }

    return function (obj, opt?, dir?) {

        if (dir == null) dir = directive;

        let i = 0, f = func, l = fi, r = [];
        for (; i < l; i++) {
            r[i] = typeof f[i] === 'string' ? f[i] : f[i].call(this, obj, opt, dir);
        }
        return r.join('');
    }
}

function __compile(html: string, directive,
                   idx = {val: 0}, lines: string[] = [], tagStack = [], index = 0) {

    let pos: number, i = pos = idx.val, e: number,
        r = [], rIdx = 0, tag: string,
        handler = function (data, opt?) {
            let result = [];
            for (let i = 0; i < rIdx; i++)
                result[i] = r[i].call(this, data, opt, directive);
            return result.join('');
        };

    // ① 태그인 경우
    if (index) {
        let [line, type, exp] = __parse(lines[index - 1]),
            _handler = handler;

        switch (type) {
            // ① 함수로 변경  :="expression"
            case '=' :
                let fn = ___createFunction(exp);
                handler = function (data, opt) {
                    let d = fn.call(this, data, opt);
                    if (d != null) return _handler.call(this, d, opt);
                    return '';
                }
                break;

            // ② 루프     ::prop
            case '::' :
                handler = function (data, opt) {
                    let val = access(data, exp);
                    if (val != null) {
                        if (Array.isArray(val)) {
                            return val.map((v, i) => _handler.call((this.index = i, this), v, opt)).join('');
                        }
                        else {
                            let r = [], i = 0, p;
                            for (p in val) {
                                this.index = p;
                                r[i++] = _handler.call(this, val[p], opt);

                            }
                            return r.join('');
                        }
                    }
                    return '';
                }
                break;

            // ③ 단순 변수  :prop
            case ':' :
                handler = function (data, opt) {
                    let val = access(data, exp);
                    return val != null ? _handler.call(this, val, opt) : '';
                }
        }

        r[rIdx++] = _replaceHTML(line);
    }


    while ((pos = html.indexOf('<', pos)) !== -1) {

        e = indexOfChar(html, '>', pos) + 1;

        // ① 여는 태그
        if (html[pos + 1] !== '/') {

            // prefix string
            if (i !== pos) {
                r[rIdx++] = _replaceHTML(html.substring(i, pos));
            }


            lines[index] = html.substring(pos, e);
            tag = tagStack[index] = __getTagName(html, pos + 1);

            idx.val = e;
            r[rIdx++] = __compile(html, directive, idx, lines, tagStack, index + 1);
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

    return handler;
}


/*
 *  단순히 문자열을 치환할때 쓴다.
 */
export function _replaceHTML(html: string, dir = directive) {

    let pos = html.indexOf('{{');
    if (pos === -1) return () => html;
    return __replaceHTML(html, pos, html.length, dir);

}


export function _compile(html, directive?) {
    let fn = __compile(html, directive);
    return function (data, opt?) {
        return fn.call({}, data, opt);
    }
}


