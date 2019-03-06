import {getElementById, getElementsByTagName} from "../../lib/core/_dom/selector";
import {_compile, _replaceHTML} from "../../lib/core/_html/replaceHTML";
import {StringBuffer} from "../../lib/core/support/StringBuffer";
import {Calendar, Month} from "../../lib/core/calendar";

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


let
    main = getElementsByTagName(document, 'main', 0),
    uu = getElementById('uu').innerText,
    c = _compile(uu);

main.innerHTML = c(create(2019, 2, 6));

let d = create(2019, 2, 6);

console.log(run([() => c(d)], 1000))

function create(y, m?, d?) {

    if (typeof y !== 'number') {
        m = y.getMonth();
        d = y.getDate();
        y = y.getFullYear();
    }

    let M = new Month(y, m),
        $result = {};

    $result['year'] = {
        val: y,
        prev: (y - 1) + '-' + (m + 1),
        next: (y + 1) + '-' + (m + 1)
    };

    $result['month'] = {
        val: m,
        prev: M.move(-1).toString(),
        next: M.move(1).toString()
    };

    $result['date'] = Calendar.toArray(y, m).map(row => {

        return row.map(col => {
            let {date, month} = col,
                className = month === m ? 'current' : '';

            if (date === d) className = 'today';

            return {
                className: className,
                val: col.isodate,
                date: date
            };
        });
    });

    return $result;
}