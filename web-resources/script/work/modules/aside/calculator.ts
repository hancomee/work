import {getElementsByAttr, querySelector} from "../../../../lib/core/_dom/selector";
import {Formats} from "../../../../lib/core/support/Formats";
import number = Formats.number;


let program = {
    m3(ele: HTMLElement) {
        let
            r_num = /^\d+$/,
            price = <HTMLInputElement>querySelector(ele, '#m3-price'),
            width = <HTMLInputElement>querySelector(ele, '#m3-width'),
            height = <HTMLInputElement>querySelector(ele, '#m3-height'),
            result = querySelector(ele, '#m3-result'),

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
    }
}

export function calculator(element: HTMLElement) {
    getElementsByAttr(element, 'data-calculator', (r, e, v) => program[v](e));
}