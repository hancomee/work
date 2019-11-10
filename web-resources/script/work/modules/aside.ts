import "../../../lib/core/component/toggle";
import {_zeroFill} from "../../../lib/core/_util/_zeroFill";
import {
    getElementsByAttr,
    getElementsByClassName,
    getElementsByTagName,
    querySelectorAll
} from "../../../lib/core/_dom/selector";
import {todo} from "./aside/todo";
import {calculator} from "./aside/calculator";
import {Calendar} from "../../../lib/core/support/Calendar";

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
    },
    values = data(),

    sideProgram = {
        todo: todo,
        calculator: calculator
    }

querySelectorAll(aside, '[data-url]', (v) => {
    if (pathname.indexOf(v.getAttribute('data-url')) !== -1)
        v.classList.add('active');
});

querySelectorAll(aside, '[data-val]', (v) => {
    v.textContent = values[v.getAttribute('data-val')];
});


getElementsByAttr(aside, 'data-pop', (r, ele, v) => {
    sideProgram[v] && sideProgram[v](ele);
});

// 시간
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

