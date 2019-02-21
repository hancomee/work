import {_move} from "../../lib/core/_func/array";
import {Events} from "../../lib/core/events";
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

let input = <HTMLInputElement>document.getElementById('input');
acceptKeys(input, (v, e) => {
   console.log('"' + v + '"');
});

console.log(input.getAttribute('asdf'),
    undefined, input.getAttribute('asdf') == null)

let a = [0,1,2,3,4,5,6,7,8];

console.log(_move(a, 5, 2));

