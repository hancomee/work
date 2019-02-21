import {Access} from "../access";
import primitive = Access.primitive;
import {Formats} from "../format";

let dummy = [null, null], dum = {},
    directive = Formats.getDirective();

// datetime : 'yyyy-MM-dd'
function $opt(str: string) {
    if (!str) return dummy;
    let [d, o] = str.split(' : ');
    return [d, o ? primitive(o) : undefined];
}


// [create] ==> func(data, directive)
function createExp(str: string) {

    let [_prop, _dir] = str.split(' | '),
        prop = _prop[0] === '_' ? _prop : '_.' + _prop,
        [dir, opt] = $opt(_dir),
        func = new Function('_', 'return _ == null ? null : (' + prop + ');')

    return (data, directive) => {
        let v = func(data);

        if (directive[dir])
            v = directive[dir](v, opt);

        return v == null ? '' : v;
    }

}


/*
 *  단순히 문자열을 치환할때 쓴다.
 */
export function _replaceHTML(html: string) {

    let index = 0, pos = 0, limit = html.length,
        func = [], fi = 0;

    while (index < limit) {

        pos = html.indexOf('{{', index);

        // {{를 찾았을때
        if (pos !== -1) {

            // ...{{  사이에 문자열이 있으면
            if (index !== pos) {
                func[fi++] = html.substring(index, pos);
            }

            index = pos = pos + 2;              // 커서를 {{ 다음으로 옮긴다.
            pos = html.indexOf('}}', index);    // }}를 찾는다

            if (pos === -1) {
                throw new Error('표현식이 잘못되었습니다. 닫는 "}}" 문자열이 없습니다')
            }

            func[fi++] = createExp(html.substring(index, pos));

            index = pos + 2;

        }

        // {{를 못 찾았다면 이제 끝
        else {
            func[fi++] = html.substring(index, limit);
            index = limit;
        }

    }

    return (obj, dir = directive) => {
        let i = 0, f = func, l = fi, r = [];
        for (; i < l; i++) {
            r[i] = typeof f[i] === 'string' ? f[i] : f[i](obj, dir);
        }
        return r.join('');
    }
}