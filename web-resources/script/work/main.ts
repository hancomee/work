import {$get} from "../../lib/core/_ajax";
import {Work} from "./_core/Work";
import {Mapping} from "../../lib/core/_dom/Mapping";
import {__findAll, __findByClass, __findById, __findByTag} from "../../lib/core/_dom/_selector";
import {Events} from "../../lib/core/_events";
import {SelectCalendar} from "../../lib/core/component/SelectCalendar";
import {Calendar} from "../../lib/core/support/Calendar";
import {Arrays} from "../../lib/core/_array";
import _map = Arrays.__map;
import __$attrEvent = Events.__$attrEvent;

type H = HTMLElement

(function () {


    let

        {body: {classList}} = document,

        main = __findByTag(document, 'main', 0),
        nav = __findByTag(document, 'nav', 0),

        dateEle = __findByClass(document, 'main-date', 0),
        selectEle = __findByClass(document, 'nav-select', 0),
        selectBtn = __findByClass(document, 'nav-select-btn', 0),
        st = <HTMLInputElement>__findById('st'),
        et = <HTMLInputElement>__findById('et'),

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
            __$attrEvent(nav, 'click', 'data-date', dirs);
            return list;
        })(__findAll(nav, '[data-date]'));


    ((ele: H, calendar: SelectCalendar) => {

        let $input: HTMLInputElement;
        calendar.onSelect = (date) => {
            $input.value = date;
            checker();
        }

        ele.addEventListener('dropdown.on', (e) => {
            let dropdown = <HTMLElement>e.target,
                input = $input = <HTMLInputElement>__findByTag(dropdown, 'input', 0),
                box = <HTMLElement>__findByClass(dropdown, 'dropdown-box', 0);

            calendar.create(new Date(input.value)).appendTo(box);
        });

    })(__findByClass('nav-select', 0), new SelectCalendar())

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
