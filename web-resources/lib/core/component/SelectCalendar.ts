import {Calendar, Month} from "../support/Calendar";
import {_compile} from "../_html/_compile";

let $html = _compile(require("./SelectCalendar.html"));


export class SelectCalendar {

    element = document.createElement('div');
    private year: number
    private month: number
    private date: number

    onSelect

    constructor() {
        this.element.classList.add('component-calendar');
        this.element.addEventListener('click', (e) => {
            let target = <HTMLElement>e.target;
            if (target.hasAttribute('data-move')) {
                let [y, m] = target.getAttribute('data-move').split('-');
                this.create(parseInt(y), parseInt(m) - 1);
                e.stopPropagation();
            }
            else if (target.hasAttribute('data-dismiss')) {
                this.onSelect && this.onSelect(target.getAttribute('data-dismiss'));
            }
        });
    }

    $element(handler: (ele: HTMLElement, c: this) => void) {
        handler(this.element, this);
        return this;
    }

    appendTo(element: HTMLElement) {
        element.appendChild(this.element);
        return this;
    }

    detach() {
        let {element} = this,
            parent = element.parentElement;
        if (parent) parent.removeChild(element);
        return element;
    }


    create(date: Date): this
    create(calendar: Calendar): this
    create(year: number, month: number, date?: number): this
    create(y, m?, d?) {

        if (typeof  y !== 'number') {
            m = y.getMonth()
            d = y.getDate();
            y = y.getFullYear();
        }

        if (typeof d === 'number') {
            this.year = y;
            this.month = m;
            this.date = d;
        }

        // 이미 선택된
        if (this.year === y && this.month === m) {
            d = this.date;
        }

        this.element.innerHTML = $html(SelectCalendar.create(y, m, d));
        return this;
    }

}

export namespace SelectCalendar {


    // month는 0부터
    // date까지 들어오면 그 날짜를 선택한다.
    export function create(date: Date)
    export function create(calendar: Calendar)
    export function create(year: number, month: number, date?: number)
    export function create(y, m?, d?) {

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

                if (month === m && date === d) className = 'select';

                return {
                    className: className,
                    val: col.isodate,
                    date: date
                };
            });
        });

        return $result;
    }


}