import {getElementById, getElementsByAttr, getElementsByClassName} from "../../lib/core/_dom/selector";
import {Work} from "./_core/Work";
import {Mapping} from "./_support/Mapping";
import {Search} from "../../lib/core/location";
import {Formats} from "../../lib/core/format";
import datetime = Formats.datetime;


let

    date = datetime(new Date(), 'yyyy-MM-dd(E) HH:mm'),
    $mapping = new Mapping()
        .addTemplate(document.head)
        .addDirective({
            type(e: HTMLElement, v) {
                if(v.biz_num !== '124-53-35359')
                    e.innerHTML = '공<br/>급<br/>받<br/>는<br/>자'
                else
                    e.innerHTML = '공<br/>급<br/>자'
            },
            now(e: HTMLElement, work: Work) {
                e.textContent = date;
            }
        }),
    types = getElementsByAttr(document.body, 'data-bill', (r, e, type) => {
        r[type] = [e, getElementById(type)];
    }, {}),

    $active = (type: string) => {
        let p;
        for (p in types) {
            let [btn, target] = types[p];
            if (type === p) {
                btn.classList.add('active');
                target.classList.add('active')
            }
            else {
                btn.classList.remove('active');
                target.classList.remove('active')
            }
        }
    };

document.addEventListener('click', (e) => {
    let target = <HTMLElement>e.target,
        type = target.getAttribute('data-bill');
    type && $active(type);
});


(function (search: Search) {

    let uuid = search['uuid'],
        type = search['type'] || 'account';

    if (uuid) {
        Work.get(uuid).then($work => {

            $work['$hancome'] = {
                name: '한컴기획',
                address: '경기도 수원시 권선구 산업로156번길 142-10 수원벤처밸리2 A동 B122호 (고색동 1152)',
                biz_con: '서비스',
                biz_num: '124-53-35359',
                biz_type: '광고기획인쇄',
                ceo: '고정철',
            };

            $mapping.setData($work);

            getElementsByClassName(document.body, 'bill', (e) => {
                $mapping.$render(e);
            });

            $active(type);
        });
    }


})(new Search().reset());



