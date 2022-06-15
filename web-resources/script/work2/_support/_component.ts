import {__find, __findByAttr} from "../../../lib/core/_dom/_selector";
import {Formats} from "../../../lib/core/_format";
import __number = Formats.__number;


type E = HTMLElement;
type A = HTMLAnchorElement;
type T = HTMLTextAreaElement;
type I = HTMLInputElement;


// 헤배계산
export function __m3(ele: HTMLElement) {

    let flag = true;

    const
        returnVal = 'Tab Enter Backspace Control',
        r_num = /[^\d]/g,
        inputs: I[] = ((map): I[] => {
            return 'm3-price m3-width m3-height m3-result'.split(' ').map(name => map[name]);
        })(__findByAttr(ele, 'name') as any),

        compute = (target: E) => {

            if(target === inputs[0]) flag = true;
            else if(target === inputs[3]) flag = false;

            inputs.forEach(input => input.value = input.value.replace(r_num, ''))

            let values = inputs.map(input => parseInt(input.value || '0')),
                [p, w, h, r] = values;

            if (flag) values[3] = Math.ceil((w * h / 1_000_000) * p);
            // 가격으로 단가계산
            else values[0] = Math.ceil(r / (w * h / 1_000_000));

            inputs.forEach((input, i) => input.value = __number(values[i], true));
        };

    ele.addEventListener('click', (e) => {
        let target = e.target as E;
        if(target.hasAttribute('data-reset'))
            inputs.forEach( input => input.value = '');
    });

    ele.addEventListener('keyup', (e) => {
        if (e.ctrlKey || returnVal.indexOf(e.key) !== -1) return;
        compute(e.target as E);
    });

}