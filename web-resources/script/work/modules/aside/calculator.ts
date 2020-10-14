import {getElementsByAttr, __find} from "../../../../lib/core/_dom/_selector";
import {Formats} from "../../../../lib/core/_format";
import number = Formats.__number;


let program = {
    m3(ele: HTMLElement) {
        let
            r_num = /^\d+$/,
            price = <HTMLInputElement>__find(ele, '#m3-price'),
            width = <HTMLInputElement>__find(ele, '#m3-width'),
            height = <HTMLInputElement>__find(ele, '#m3-height'),
            result = __find(ele, '#m3-result'),

            compute = () => {
                let pVal = price.value.trim(),
                    wVal = width.value.trim(), hVal = height.value.trim();
                if (r_num.test(pVal) && r_num.test(wVal)&& r_num.test(hVal)) {
                    let p = parseInt(pVal),
                        w = parseInt(wVal), h = parseInt(hVal);
                    result.textContent = number(Math.ceil((w * h / 1000000) * p));
                } else {
                    result.textContent = '';
                }
            };

        price.addEventListener('keyup', compute);
        width.addEventListener('keyup', compute);
        height.addEventListener('keyup', compute);
    },
    tax(ele: HTMLElement) {

    }
}

export function calculator(element: HTMLElement) {
    getElementsByAttr(element, 'data-calculator', (r, e, v) => program[v](e));
}