import "../../../lib/core/component/toggle";
import {__zeroFill} from "../../../lib/core/_util/_zeroFill";
import {
    getElementsByAttr,
    __findByClass,
    __findByTag,
    __findAll
} from "../../../lib/core/_dom/_selector";
import {todo} from "./aside/todo";
import {calculator} from "./aside/calculator";
import {Calendar} from "../../../lib/core/support/Calendar";

let
    aside = __findByTag(document.body, 'aside', 0),
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
    },
    values = data(),

    sideProgram = {
        todo: todo,
        calculator: calculator
    }

__findAll(aside, '[data-url]').forEach(v => {
    if (pathname.indexOf(v.getAttribute('data-url')) !== -1)
        v.classList.add('active');
});

__findAll(aside, '[data-val]').forEach(v => {
    v.textContent = values[v.getAttribute('data-val')];
});


getElementsByAttr(aside, 'data-pop', (r, ele, v) => {
    sideProgram[v] && sideProgram[v](ele);
});

// 시간
(function (hour: HTMLElement, time: HTMLElement) {

    function clock() {
        var currentDate = new Date(),
            currentHours = __zeroFill(currentDate.getHours(), 2),
            currentMinute = __zeroFill(currentDate.getMinutes(), 2),
            currentSeconds = __zeroFill(currentDate.getSeconds(), 2);
        hour.textContent = currentHours + ":" + currentMinute;
        time.textContent = ":" + currentSeconds;
        setTimeout(clock, 1000);
    }

    clock();

})(
    __findByClass(aside, 'aside-today-time-hour', 0),
    __findByClass(aside, 'aside-today-time-second', 0)
);

