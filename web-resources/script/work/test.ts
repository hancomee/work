import {getElementById, getElementsByClassName, getElementsByTagName} from "../../lib/core/_dom/selector";
import {_compile, _replaceHTML} from "../../lib/core/_html/replaceHTML";
import {StringBuffer} from "../../lib/core/support/StringBuffer";
import {Calendar, Month} from "../../lib/core/calendar";
import {Formats} from "../../lib/core/format";
import toDate = Formats.toDate;
import {indexOfChar} from "../../lib/core/_html/_indexOf";

function run(fns: any[], nums: number) {

    return fns.map(f => {
        var startTime = new Date().getTime(),
            i = 0;

        for (; i < nums; i++) {
            f();
        }

        var endTime = new Date().getTime();
        return endTime - startTime;
    })
}


let __findClose = (html: string, pos: number) => {
        let t;
        while ((t = html[pos++]) !== '>') {
            if (t === '"') pos = html.indexOf('"', pos) + 1;
        }
        return pos;
    },
    str = ['<li class="{{_ == $ ? \'active\' : \'\'}}" data-dismiss="{{_}}" ::>',
        '<li class="{{_ == $ ? \'active\' : \'\'}}" data-dismiss="{{_}}">',
        '<input :="asdf adf"/>',
        '<li class="{{_ == $ ? \'active\' : \'\'}}" data-dismiss="{{_}}" ::df>',
        '<li class="{{_ == $ ? \'active\' : \'\'}}" data-dismiss="{{_}}" :="_ + 5">',
        '<li class="{{_ == $ ? \'active\' : \'\'}}" data-dismiss="{{_}}" :adf>',
        '<li class="{{_ == $ ? \'active\' : \'\'}}" data-dismiss="{{_}}" :>'];


function str2(str: string) {

    let l = str.length,
        pos = str.lastIndexOf(' :');

    if (pos !== -1) {

        // ① :="..."
        if (str[pos + 2] === '=') {
            console.log('=')
            if (str[pos + 3] === '"') {
                let d = str.lastIndexOf('"');
                return [str.substring(0, pos) + str.substring(d + 1, l), '=',
                    str.substring(pos + 4, d)]
            }
        }

        // ② ::prop
        else if (str[pos + 2] === ':') {
            console.log('::')
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

    return [str, 'none'];
}

let d = _compile(getElementById('test').innerText);

console.log(d({}));