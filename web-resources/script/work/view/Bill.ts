import {Mapping} from "../../../lib/core/support/Mapping";
import {Formats} from "../../../lib/core/format";
import datetime = Formats.datetime;
import {Customer, Work} from "../_core/Work";
import {getElementById, getElementsByClassName} from "../../../lib/core/_dom/selector";

let
    element = getElementById('bill'),
    types = getElementsByClassName(element, 'bill',
        (e, i, r) => {
            element.removeChild(e);
            r[e.id] = e
        }, {}),

    hancome = {
        name: '한컴기획',
        address: '경기도 수원시 권선구 산업로156번길 142-10 수원벤처밸리2 A동 B122호 (고색동 1152)',
        biz_con: '서비스',
        biz_num: '124-53-35359',
        biz_type: '광고기획인쇄',
        owner: '고정철',
    },

    date = datetime(new Date(), 'yyyy-MM-dd(E) HH:mm'),
    $mapping = new Mapping()
        .addTemplate(getElementById('bill-template'))
        .addDirective({
            // 공급자, 공급받는자 구분
            check(e: HTMLElement, v) {
                if (v.biz_num !== '124-53-35359')
                    e.classList.add('send')
            },
            // 견적메모가 없을 경우에는 엘리먼트를 없앤다.
            exists(e: HTMLElement, work: Work) {
                let {text} = work;
                if(!text.trim()) e.classList.add('hide');
                else e.classList.remove('hide');
            },
            now(e: HTMLElement, work: Work) {
                e.textContent = date;
            },
        });

element.addEventListener('click',
    (e) => {
        if(e.target === element) {
            element.classList.remove('on');
            element.textContent  = '';
            document.body.classList.remove('scroll-lock');
        }
    })

element.textContent  = '';

export function $bill($work: Work, type: string) {

    $work['$hancome'] = hancome;

    $mapping.setData($work);
    $mapping.$render(types[type]);
    element.appendChild(types[type]);

    document.body.classList.add('scroll-lock');
    element.classList.add('on');

}





