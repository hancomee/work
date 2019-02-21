import {Formats} from "./format";
import date = Formats.date;
import datetime = Formats.datetime;

let second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24,
    __day = ["일", "월", "화", "수", "목", "금", "토"];

export class Month {

    // month는 0부터
    constructor(public year: number, public month: number) {
    }


    move(val: number) {
        let {year, month} = this,
            i = 1;
        if (val < 0) val = val * (i = -1);

        while (val-- > 0) {
            month = month + i;
            if (month > 11) {
                year++;
                month = 0;
            }
            else if (month < 0) {
                year--;
                month = 11;
            }
        }
        return new Month(year, month);
    }

    toArray() {
        return Calendar.toArray(this.year, this.month);
    }

    toString() {
        return this.year + '-' + (this.month + 1);
    }
}

export class Calendar {

    private value: Date

    constructor(_value?: Date | number) {
        if (_value == null)
            this.value = new Date();
        else
            this.value = _value instanceof Date ? _value : new Date(_value);
    }

    get year() {
        return this.value.getFullYear();
    }

    get month() {
        return this.value.getMonth();
    }

    get date() {
        return this.value.getDate();
    }

    get day() {
        return this.value.getDay();
    }

    get longtime() {
        return this.value.getTime();
    }

    // Date와 인터페이스를 맞추기 위한 메서드들
    getFullYear() {
        return this.year;
    }

    getMonth() {
        return this.month;
    }

    $date(num: number) {
        if (!num) return this;
        return new Calendar(new Date(this.longtime + (num * day)));
    }

    $month(num: number) {
        if (!num) return this;

        var _a = this, y = _a.year, m = _a.month, date = _a.date,
            expectMonth = m + num, // 희망하는 달
            len = y * 12 + expectMonth, // 년도를 달로 고쳐서 숫자를 만든다.
            result = new Calendar(new Date(len / 12, len % 12, date));
        /*
         *  만약 this가 10월 31일 이라면, 달만 더하면 11월 31일이 되는데,
         *  11월 31일은 없으므로 12월 1일이 되어버린다.
         *  따라서 이를 보정한다.
         *  해당하는 달이 될때까지 날짜를 빼나간다.
         */
        var i = 11;
        expectMonth = expectMonth % 12;
        expectMonth = expectMonth < 0 ? 11 : expectMonth;
        while (result.month !== expectMonth) {
            result = result.$date(-1);
            // 로직에 문제는 없지만 혹시 모르니까 추가해둔다.
            // 여기서 무한루프에 빠지면 디버깅이 존나 힘들것이므로..
            if (i-- < 0)
                throw new Error('무한루프에 빠질 위험이 있습니다!!');
        }
        return result;
    }

    $year(num: number) {
        if (!num)
            return this;
        var _a = this, year = _a.year, month = _a.month, date = _a.date;
        return new Calendar(new Date(year + num, month, date));
    }

    getFirstDate() {
        return new Calendar(new Date(this.year, this.month, 1));
    }

    getLastDate() {
        return new Calendar(new Date(this.year, this.month + 1, 0));
    }

    setTime(value?: Date) {
        if (value === void 0) {
            value = new Date();
        }
        var _a = this, year = _a.year, month = _a.month, date = _a.date;
        return new Calendar(new Date(year, month, date, value.getHours(), value.getMinutes(), value.getSeconds()));
    }

    get isodate() {
        return date(this.value);
    }

    year_kr() {
        return this.year + '';
    }

    month_kr() {
        var month = this.month + 1;
        return (month < 10 ? '0' : '') + month;
    }

    date_kr() {
        var date = this.date;
        return (date < 10 ? '0' : '') + date;
    }

    day_kr() {
        return __day[this.day];
    }

    durationDate(target: Date) {
        var origLong = Math.floor(this.longtime / day) * day, targetLong = Math.floor(target.getTime() / day) * day;
        return (targetLong - origLong) / day;
    }

    durationMonth(target) {
        var origY = this.getFullYear() * 12 + this.getMonth(), targetY = target.getFullYear() * 12 + target.getMonth();
        return targetY - origY;
    }

    durationYear(target) {
        return target.getFullYear() - this.getFullYear();
    }

    format(str?: string) {
        if (str === void 0) {
            str = 'yyyy-MM-dd';
        }
        return datetime(this.value, str);
    }

    equals(data) {
        var _a = this, year = _a.year, month = _a.month, date = _a.date;
        if (year !== data.getFullYear())
            return false;
        if (month !== data.getMonth())
            return false;
        if (date !== data.getDate())
            return false;
        return true;
    }

    toString() {
        return datetime(this.value);
    }

    clone() {
        return new Calendar(this.longtime);
    }
}

export namespace Calendar {

    export let format = datetime;

    export function create(year: number, month: number, date: number, h: number, m: number, s: number): Calendar
    export function create(year: number, month: number, date: number): Calendar
    export function create(value: number): Calendar
    export function create(value: Date): Calendar
    export function create(): Calendar
    export function create(v1?, v2?, v3?, v4?, v5?, v6?) {
        let v = v1;

        if (typeof v6 === 'number') v = new Date(v1, v2 - 1, v3, v4, v5, v6);
        else if (typeof v3 === 'number') v = new Date(v1, v2 - 1, v3);

        return new Calendar(v);
    }


    function monthInfo(year, month) {
        var first = new Date(year, month, 1), last = new Date(year, month + 1, 0);
        return [first.getDate(), first.getDay(), last.getDate(), last.getDay()];
    }


    function today(str: string = 'yyyy-MM-dd') {
        return datetime(new Date(), str);
    }

    // 달력을 만들기 위한 배열
    export function toArray(y, m): Calendar[][] {

        var _a = monthInfo(y, m), fd = _a[1], l = _a[2],
            start = new Calendar(new Date(y, m, 1)).$date((fd % 7 * -1) - 1), // 1를 빼는 이유는 일요일도 포함시키기 위함
            row = Math.ceil((l + fd % 7) / 7), i = 0, result = [];

        while (row > 0) {
            var r = [];
            for (; i < 7; i++) {
                r.push(start = start.$date(1));
            }
            result.push(r);
            i = 0;
            row--;
        }
        return result;
    }

    export function isodate(year: number, month: number, day: number)
    export function isodate(date: Date)
    export function isodate(y, m?, d?) {
        let dd: Date = y;
        if (typeof dd === 'number') dd = new Date(y, m, d);
        return date(dd);
    }
}
