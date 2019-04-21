import {$get} from "../../lib/core/_util/_ajax";
import {Customer, Work} from "./_core/Work";
import {Calendar} from "../../lib/core/calendar";
import {Mapping} from "../../lib/core/support/Mapping";
import {
    getElementById,
    getElementsByClassName,
    getElementsByTagName,
    querySelectorAll
} from "../../lib/core/_dom/selector";
import {Events, iEvents} from "../../lib/core/events";
import dataEvent = Events.dataEvent;
import {_map} from "../../lib/core/_func/array";
import {SelectCalendar} from "../../lib/core/component/SelectCalendar";
import {HTML} from "../../lib/core/html";
import selectAll = HTML.selectAll;
import {FormEvent} from "../../lib/core/form/FormEvent";
import calendar = FormEvent.calendar;

type H = HTMLElement

(function () {


    let

        {body: {classList}} = document,

        main = getElementsByTagName(document, 'main', 0),
        nav = getElementsByTagName(document, 'nav', 0),

        dateEle = getElementsByClassName(document, 'main-date', 0),
        selectEle = getElementsByClassName(document, 'nav-select', 0),
        selectBtn = getElementsByClassName(document, 'nav-select-btn', 0),
        st = <HTMLInputElement>getElementById('st'),
        et = <HTMLInputElement>getElementById('et'),

        mapping = new Mapping()
            .addTemplate(document.head)
            .addDirective({
            }),

        r_date = /\d{4}-\d{1,}-\d{1,}/,
        checker = () => {
            let stv = st.value, etv = et.value;
            if (r_date.test(stv) && r_date.test(etv)) {
                if (new Date(stv) < new Date(etv)) {
                    return selectEle.classList.add('active');
                }
            }
            selectEle.classList.remove('active');
        },

        staticDate = {
            currentMonth() {
                let today = new Calendar();
                return [today.getFirstDate().isodate, today.isodate];
            },
            currentYear() {
                return [new Date().getFullYear() + '-01-01', new Calendar().isodate];
            }
        },

        /*
         *  이번달, 올해 등 날짜설정
         */
        btnCheck = (function (btns) {
            let
                dirs = {},
                list = _map(btns, (e) => {
                    let
                        {classList} = e,
                        name = e.getAttribute('data-date'),
                        fn = staticDate[name];

                    //data이벤트
                    dirs[name] = () => load.apply(null, fn())

                    return (st, et) => {
                        let [s, e] = fn();
                        if (st === s && et === e) {
                            classList.add('active');
                        } else classList.remove('active');
                    }
                });
            dataEvent(nav, 'click', 'data-date', dirs);
            return list;
        })(querySelectorAll(nav, '[data-date]'));


    ((ele: H, calendar: SelectCalendar) => {

        let $input: HTMLInputElement;
        calendar.onSelect = (date) => {
            $input.value = date;
            checker();
        }

        ele.addEventListener('dropdown.on', (e) => {
            let dropdown = <HTMLElement>e.target,
                input = $input = <HTMLInputElement>getElementsByTagName(dropdown, 'input', 0),
                box = <HTMLElement>getElementsByClassName(dropdown, 'dropdown-box', 0);

            calendar.create(new Date(input.value)).appendTo(box);
        });

    })(getElementsByClassName('nav-select', 0), new SelectCalendar())

    // 직접 선택
    selectBtn.addEventListener('click', () => {
        selectEle.classList.contains('active') && load(st.value, et.value);
    });


    let r_item = {
        card: /명함/,
        sticker: /스티커/,
        banner: /배너/,
        silsa: /실사/,
    }


    function compute(list: Work[]) {

        let total = 0, vat = 0, price = 0,
            customers = {}, items = {},
            cArray = [], iArray = [];

        list.forEach(work => {

            let {name} = work.customer,
                customer = customers[name];

            if (!customer) {
                customer = customers[name] = {name: name, count: 0, total: 0, vat: 0};
                cArray.push(customer);
            }

            work.items.forEach(item => {
                let {count, price: p, total: t, vat: v, subject} = item;

                customer.count++;
                customer.total += (p * count);
                customer.vat += v;
                total += t;
                vat += v;
                price += (p * count);

            });
        });

        return {
            total: total,
            vat: vat,
            price: price,
            customers: cArray.sort((a, b) => a.total > b.total ? -1 : 1)
        }
    }

    function load(startDate, endDate): Promise<Work[]> {

        classList.add('loading')

        return $get('/work/db/report?st=' + startDate + '&et=' + endDate).then(v => {

            dateEle.textContent = startDate + ' ~ ' + endDate;
            st.value = startDate;
            et.value = endDate;

            btnCheck.forEach(f => f(startDate, endDate));

            let val = v.map(val => new Work(val));
            mapping.setData(compute(val)).$render(main);

            classList.remove('loading')
            return val;
        });
    }

    load.apply(null, staticDate.currentMonth());

})()
