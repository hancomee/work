import {Mapping} from "../../../lib/core/support/Mapping";
import {Formats} from "../../../lib/core/format";
import datetime = Formats.datetime;
import {Customer, Work} from "../_core/Work";
import {getElementById, getElementsByClassName} from "../../../lib/core/_dom/selector";
import {Events, EventsGroup} from "../../../lib/core/events";
import catchKey = Events.catchKey;

let
    element = getElementById('bill'),
    {classList} = element,
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
        sign: 'sign.png'
    },
    hancome2 = {
        name: '한컴기획',
        address: '경기도 군포시 금정동 873-1 현대프라자 606',
        biz_con: '서비스',
        biz_num: '123-27-78109',
        biz_type: '광고기획인쇄',
        owner: '고성재',
        sign: 'sign2.png'
    },

    // 스크린캡쳐할때 수원|군포 버튼 없애기
    key = (function () {
        let upHandler = (e: KeyboardEvent) => {
                if (!e.ctrlKey) {
                    classList.remove('ctrl');
                    document.removeEventListener('keyup', upHandler);
                    document.addEventListener('keydown', pressHandler);
                }
            },
            pressHandler = (e: KeyboardEvent) => {
                if (e.ctrlKey) {
                    classList.add('ctrl');
                    document.addEventListener('keyup', upHandler);
                    document.removeEventListener('keydown', pressHandler);
                }
            }
        return (flag: boolean) => {
            classList.remove('ctrl');
            if (flag) document.addEventListener('keydown', pressHandler);
            else document.addEventListener('keydown', pressHandler);
        };
    })(),

    date = datetime(new Date(), 'yyyy-MM-dd(E) HH:mm'),
    $mapping = new Mapping()
        .addTemplate(getElementById('bill-template'))
        .addDirective({
            // 공급자, 공급받는자 구분
            check(e: HTMLElement, v) {
                if (!v.sign)
                    e.classList.add('send')
            },
            // 견적메모가 없을 경우에는 엘리먼트를 없앤다.
            exists(e: HTMLElement, work: Work) {
                let {text} = work;
                if (!text.trim()) e.classList.add('hide');
                else e.classList.remove('hide');
            },
            now(e: HTMLElement, work: Work) {
                e.textContent = date;
            },

            sign(e: HTMLImageElement, own: any) {
                if (own.sign) {
                    e.src = '/imgs/' + own.sign;
                }
                else
                    e.parentElement.removeChild(e);
            }
        });

element.addEventListener('click',
    (e) => {
        let target = <HTMLElement>e.target;

        if (target === element) {
            key(false);
            element.classList.remove('on');
            element.textContent = '';
            document.body.classList.remove('scroll-lock');
        }
        else if (target.hasAttribute('data-switch-type')) {
            element.setAttribute('data-switch', target.getAttribute('data-switch-type'))
        }
    })

element.textContent = '';
element.setAttribute('data-switch', 'hancomee')

export function $bill($work: Work, type: string) {

    $work['$hancome'] = hancome;
    $work['$hancome2'] = hancome2;


    $mapping.setData($work);
    $mapping.$render(types[type]);
    element.appendChild(types[type]);

    document.body.classList.add('scroll-lock');
    element.classList.add('on');

    key(true);

}





