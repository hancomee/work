import {Events, EventsGroup} from "../_events";
import {__className} from "../_dom/_commons";

export namespace FormEvent {

    let
        {forEach} = Array.prototype,
        placeholder_props = 'text number',

        func = {
            number: (function (r) {
                return (s: string) => {
                    let minus = s[0] === '-';
                    s = s.replace(r, '');
                    return minus ? '-' + s : s;
                };
            })(/[^\d]/g),
        }

    // 달력
    export function calendar(input: HTMLInputElement) {

    }

    // 플레이스홀더 설정
    export function placeholder(input: HTMLInputElement,
                                val = input.getAttribute('data-placeholder')): EventsGroup {

        if (placeholder_props.indexOf(input.getAttribute('data-type') || input.type) === -1)
            return null;

        let isActive: boolean,
            handler = () => {
                if (isActive = !input.value) input.value = val;
                __className(input, 'empty', isActive);
            }

        handler();

        return new EventsGroup()
            .register(input, 'focus', () => isActive && (input.value = ''))
            .register(input, 'change', handler)
            .register(input, 'blur', handler);
    }

    // 사용하면 안되는 문자를 기입한다.
    export function replace(input: HTMLInputElement, regHandler: (this: HTMLInputElement, s: string) => string) {
        let handler = () => input.value = regHandler.call(input, input.value);

        return new EventsGroup()
            .register(input, 'keyup', handler)
            .register(input, 'change', handler)
    }

    export function numbers(input: HTMLInputElement) {
        return replace(input, func.number);
    }

    export function __$number(input: HTMLInputElement | HTMLTextAreaElement) {
        return new Events(input, 'keyup', () => {
            let {value} = input, flag = value[0] === '-' ? '-' : '';
            value = value.replace(/[^\d]/g, '');
            input.value = flag + value;
        })
    }

    export function __$money(input: HTMLInputElement) {

        let handler = () => {
            let prefix = input.value[0],
                value = input.value.replace(/[^\d]+/g, '');
            if (prefix !== '-') prefix = '';
            if (value.length > 3) {
                value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            input.value = prefix + value;
        }
        input.addEventListener('keyup', handler);
        input.addEventListener('change', handler);
        return input;

    }

    export function __$date(input: HTMLInputElement) {
        let handler = () => {
            let value = input.value.replace(/[^\d]+/g, '').slice(0, 8),
                m = /(\d{4})(\d{1,2})?(\d{1,2})?/.exec(value);
            if (m) {
                if (m[3]) value = [m[1], m[2], m[3]].join('-');
                else if (m[2]) value = m[1] + '-' + m[2];
                else value = m[1] + '-';
            }
            input.value = value
        }
        input.addEventListener('keyup', handler);
        input.addEventListener('change', handler);
        return input;
    }

    export function checkLen(inputs: ArrayLike<HTMLElement>, min = 0, max = inputs.length) {
        let select = [],
            handler = (e) => {
                let input = <HTMLInputElement>e.target,
                    {length} = select;

                // 추가할때
                if (input.checked) {
                    while (length >= max) {
                        select.shift().checked = false;
                        length--;
                    }
                    select[length] = input;
                }
                // 뺄때
                else {
                    if (length > min) {
                        select.splice(select.indexOf(input), 1);
                    } else input.checked = true;
                }
            },
            group = new EventsGroup();


        forEach.call(inputs, (v) => {
            v.checked && select.push(v);
            group.register(v, 'change', handler)
        });
        return group;
    }
}
