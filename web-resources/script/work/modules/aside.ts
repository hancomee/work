import {Calendar} from "../../../lib/core/calendar";
import {_zeroFill} from "../../../lib/core/_util/_zeroFill";
import {getElementsByClassName, getElementsByTagName, querySelectorAll} from "../../../lib/core/_dom/selector";

let
    aside = getElementsByTagName(document.body, 'aside', 0),
    {pathname} = location,
    data = () => {
        let date = new Calendar(),
            [ym, e] = date.format('yyyy년 M월:(E)').split(':'),
            [c, t] = date.$week();
        return {
            ym: ym,
            lastdate: '/' + date.getLastDate().date,
            date: date.date,
            week: c + '/' + t + '주차 ' + e
        };
    }

querySelectorAll(aside, '[data-url]', (v) => {
    if (pathname.indexOf(v.getAttribute('data-url')) !== -1)
        v.classList.add('active');
});
let values = data();
querySelectorAll(aside, '[data-val]', (v) => {
    v.textContent = values[v.getAttribute('data-val')];
});

(function (hour: HTMLElement, time: HTMLElement) {

    function clock() {
        var currentDate = new Date(),
            currentHours = _zeroFill(currentDate.getHours(), 2),
            currentMinute = _zeroFill(currentDate.getMinutes(), 2),
            currentSeconds = _zeroFill(currentDate.getSeconds(), 2);
        hour.textContent = currentHours + ":" + currentMinute;
        time.textContent = ":" + currentSeconds;
        setTimeout(clock, 1000);
    }

    clock();

})(
    getElementsByClassName(aside, 'aside-today-time-hour', 0),
    getElementsByClassName(aside, 'aside-today-time-second', 0)
);

