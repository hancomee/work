import {Events} from "../../lib/core/events";
import {Formats} from "../../lib/core/format";
import {_replaceHTML} from "../../lib/core/_html/replaceHTML";
import {Work} from "./_core/Work";
import {_range} from "../../lib/core/_func/array";
import acceptKeys = Events.acceptKeys;

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

let input = <HTMLInputElement>document.getElementById('input'),
    result = <HTMLInputElement>document.getElementById('result');
acceptKeys(input, (v, e) => {
    let i = parseInt(input.value);
    if(typeof  i === 'number') {
    }
});


let d = '<li class="{{$.index === _.state ? "active" : ""}}">{{$[$.index]}}</li>',
    ff = _replaceHTML(d),
    value = ((s) => s.reduce((r,v,i) => (r[i] = v, r), {index: -1}))(Work.$state);

_range(0,7, (v) => {
    value.index = v;
    console.log(ff({state: 3}, null, value));
})



