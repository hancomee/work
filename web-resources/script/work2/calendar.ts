import "../../lib/core/_event/_toggle";
import {Calendar} from "../../lib/core/support/Calendar";
import {Template} from "../../lib/core/_dom/_template";
import {Search} from "../../lib/core/support/Search";
import {Events} from "../../lib/core/_events";
import __$attrEvent = Events.__$attrEvent;
import {__findByAttr} from "../../lib/core/_dom/_selector";
import {Formats} from "../../lib/core/_format";
import __datetime = Formats.__datetime;
import {$delete, $post, __appendFragment} from "./_support/_util";
import {__extend} from "../../lib/core/_core";

type DATA = {
    id: number
    created: number
    date: string
    category: string
    text: string
    complete: number
    priority: number
}

type SERVER_DATA = { [index: string]: DATA[] };

type E = HTMLElement;
type A = HTMLAnchorElement;
type T = HTMLTextAreaElement;
type I = HTMLInputElement;

Template.addFilter({

});

const

    $categories = '일정 시공 방문 메모'.split(' '),
    {map, forEach} = Array.prototype,
    __navi = (y: number, m: number) => {
        let p = m - 1, n = m + 1,
            $p = [y, p], $n = [y, n];
        if (p < 0) $p = [y - 1, 11];
        if (n > 11) $n = [y + 1, 0];
        return [$p.join('-'), $n.join('-')];
    },
    // 0 : 이번달 아님  1 : 이번달  2: 오늘
    __match = (y: number, m: number, d: number, target: Calendar) => {
        if (d === target.date && y === target.year && m === target.month) return 2;
        if (m === target.month) return 1;
        return 0;
    },

    tempData: SERVER_DATA = {
        '2022-06-11': [
            {
                id: 1,
                created: new Date().getTime(),
                category: '일정',
                text: '한방병원 공사 시작',
                date: '',
                complete: 1,
                priority: 1
            },
            {
                id: 2,
                created: new Date().getTime(),
                category: '일정',
                text: '진여수 방문 공사',
                date: '',
                complete: 1,
                priority: 1
            },
        ],
        '2022-06-12': [
            {
                id: 3,
                created: new Date().getTime(),
                category: '메모',
                text: '한방병원 공사완료',
                date: '',
                complete: 1,
                priority: 1
            },
        ],
        '2022-06-13': [
            {
                id: 4,
                created: new Date().getTime(),
                category: '일정',
                text: '기흥테라타워 공사',
                date: '',
                complete: 1,
                priority: 1
            },
        ],
    };

class CalendarSearch extends Search {
    y: number
    m: number

    constructor() {
        super();
        let date = new Date();
        this.y = date.getFullYear();
        this.m = date.getMonth();
    }
}

@Template('&day')
class Day {
    static $create: (data?) => Day


    values: DayContent[]

    constructor(public element: E,
                public container: E,
                public calendar: Calendar,
                public data: DATA[],
                public chk: number,
                public date = calendar.isodate
    ) {

        this.values = data.map(data => DayContent.$create({data: data, day: this}));
        this.render();

    }

    render() {
        this.container.textContent = '';
        this.container.appendChild(__appendFragment(this.values, true));
        return this;
    }

    addContent(data: DATA) {
        this.values.push(DayContent.$create({data: data, day: this}));
        return this.render();
    }

    removeContent(dayContent: DayContent) {
        let {values} = this, pos = values.indexOf(dayContent);
        values.splice(pos, 1);
        return this.render();
    }

    isOn() {
        return this.element.getAttribute('data-screen') === '1';
    }

    on() {
        this.element.setAttribute('data-screen', '1');
        return this;
    }

    off() {
        this.element.setAttribute('data-screen', '0');
        return this;
    }

    apply() {
        return this;
    }
}

@Template('&dayContent')
class DayContent {
    static $create: (data?) => DayContent

    constructor(
        public element: E,
        public category: E,
        public data: DATA,
        public day: Day
    ) {
    }

    apply(data?) {
        __extend(this.data, data)
        return this;
    }
}


@Template('&dayContentForm')
class DayContentForm {
    static $create: (data?) => DayContentForm

    day: Day
    content: DayContent

    constructor(
        public element: E,
        public textarea: T,
        public categories: E,
        public categoryBtn: E,
    ) {
        categories.innerHTML = '<ul>' +
            $categories.map(v => '<li data-event="categorySelect" data-dismiss data-category="' + v + '">' +
                '<span class="dropdown-item">' + v + '</span></li>').join('') +
            '</ul>';
    }

    on(day: Day, content?: DayContent) {
        this.day = day;
        if (this.content = content) {
            this.reset(content.data.category, content.data.text);
            this.textarea.value = content.data.text;
            day.container.insertBefore(this.element, content.element);
        } else {
            day.container.appendChild(this.reset($categories[0], '').element);
        }
        return this;
    }

    reset(category: string, text = this.textarea.value) {
        this.categoryBtn.textContent = category;
        this.textarea.value = text;
        return this;
    }

    off() {
        let {element, element: {parentElement}} = this;
        if (parentElement) parentElement.removeChild(element);
        return this;
    }

    values(data?) {
        return __extend({
            text: this.textarea.value,
            category: this.categoryBtn.textContent
        }, data);
    }

    apply() {
        return this;
    }
}

(function (search: CalendarSearch) {

    let
        $month = document.getElementById('month'),
        $contentForm = DayContentForm.$create({data: {}}),


        {prev, current, next} = __findByAttr(document.getElementsByTagName('nav')[0], 'data-navi'),

        __load = () => {

            const fragment = document.createDocumentFragment(),
                values = [],
                {year, month, date} = Calendar.create(),
                [_prev, _next] = __navi(search.y, search.m),

                $array = Calendar.toArray(search.y, search.m),
                st = $array[0][0],
                et = ((array) => array[array.length - 1])($array[$array.length - 1]);


            fetch('/calendar/list?st=' + st.isodate + '&et=' + et.isodate).then(res => res.json())
                .then(($values: SERVER_DATA) => {

                    prev.setAttribute('data-navi', _prev);
                    next.setAttribute('data-navi', _next);
                    current.textContent = search.y + '년 ' + (search.m + 1) + '월';

                    $array.forEach(array => {
                        array.forEach(value => {
                            let
                                day = Day.$create({
                                    calendar: value,
                                    chk: __match(search.y, search.m, 0, value),
                                    data: $values[value.isodate] || []
                                });

                            // 오늘인지 구하기
                            if (__match(year, month, date, value) === 2) day.chk = 2;

                            fragment.appendChild(day.apply().element);
                            values.push(day);
                        })
                    });

                    $month.textContent = '';
                    $month.appendChild(fragment);

                })

        }

    __load();
    window.addEventListener('hashchange', __load);

    __$attrEvent(document.body, 'click', 'data-event', class {

            day: Day
            dayContent: DayContent
            navi: string
            category: string
            complete: number

            constructor(public e: MouseEvent, public eventTarget: E) {
            }

            _template(e) {
                this[e.getAttribute('_template')] = Template.get(e);
            }
        },
        // **** Directive
        {
            $init() {
                // 스크린 닫는건 mousedown 이벤트로 한다.
                $month.addEventListener('mousedown', (e) => {
                    let {parentElement} = e.target as E;
                    if (parentElement && parentElement.getAttribute('data-screen') === '1') {
                        Template.get(parentElement).off();
                        $contentForm.off();
                    }
                });
            },
            navi({navi}) {
                let [y, m] = navi.split('-');
                search.writeHash({y: parseInt(y), m: parseInt(m)});
            },
            screen({day}) {
                day.on();
            },
            categorySelect({category}) {
                $contentForm.reset(category);
            },
            add({day}) {
                $contentForm.on(day);
            },
            modifyContent({dayContent}) {
                $contentForm.on(dayContent.day, dayContent);
            },
            removeContent({dayContent}) {
                $delete('/calendar/remove/' + dayContent.data.id).then(res => {
                    dayContent.day.removeContent(dayContent);
                });
            },
            confirmContent({}) {
                let {day, content} = $contentForm,
                    isNew = !content,
                    values: any = {};

                if (isNew) {
                    values = {
                        priority: day.values.length,
                        create: new Date().getDate(),
                        date: day.date,
                        complete: 0
                    };
                } else values.id = content.data.id;

                values = $contentForm.values(values);

                $post('/calendar/save', values).then(res => res.json()).then(id => {
                    values.id = id;
                    if (isNew) day.addContent(values);
                    else content.apply(values);
                    $contentForm.off();
                });

            },
            cancelContent() {
                $contentForm.off();
            },
            complete({dayContent, complete}) {
                const {data} = dayContent,
                    values = {
                        id: data.id,
                        complete: complete ? 0 : 1
                    };
                $post('/calendar/save', values).then(res => {
                    dayContent.apply(values);
                });
            }


        })

})(new CalendarSearch().resetHash().writeHash())



