import {_forEach} from "../../../lib/core/_func/array";
import {Events} from "../../../lib/core/events";
import acceptKeys = Events.acceptKeys;
import {Customer, Work} from "../_core/Work";
import {DOM} from "../../../lib/core/dom";
import className = DOM.className;


export class WorkCreator {

    private init;

    search: HTMLInputElement
    title: HTMLInputElement

    cancelBtn: HTMLElement
    confirmBtn: HTMLElement
    createBtn: HTMLElement

    result: HTMLElement

    /*
     *  state-0 : 초기화
     *  state-1 : 거래처 선택
     *  state-2 : 타이틀 입력
     *
     */
    constructor(public element: HTMLElement) {

        // [data-prop] 가진 엘리먼트 객체에 붙이기
        _forEach(element.querySelectorAll('[data-prop]'),
            (v) => this[v.getAttribute('data-prop')] = v);

        let
            {search, title, cancelBtn, confirmBtn, createBtn, result} = this,

            {classList: eClass} = element,
            {classList: cClass} = createBtn,

            keyword: string,
            data: Customer[],
            select: Customer,

            $load = () => {
                Customer.search(keyword).then(values => {
                    if ((data = values).length) {

                        console.log(keyword, values);
                        // 딱 맞는 이름이 있는지
                        let l = data.length,
                            matched = false;

                        result.innerHTML = values.map((customer, idx) => {
                            let {name} = customer;
                            if (keyword === name) matched = true;
                            return '<div data-index="' + idx + '"><i>' + l-- + '</i>' +
                                name + '</div>';
                        }).join('');

                        // 매치되는 이름이 없을때만 새로만들기 버튼을 활성화
                        if (matched) cClass.remove('active');
                        else cClass.add('active');

                    } else {
                        result.textContent = '';
                    }
                })
            };

        // ① 거래처 검색
        acceptKeys(search, (v) => {
            eClass.remove('confirm-customer');
            title.disabled = true;
            if (keyword = v) $load();
            else result.textContent = '';
        });

        // ② 거래처 만들기
        createBtn.addEventListener('click', () => {
            console.log(keyword + ' 업체 생성!!');
        });

        // ③ 거래처 선택
        result.addEventListener('click', (e) => {
            let target = <HTMLElement>e.target,
                idx = target.getAttribute('data-index');
            if (idx) {
                search.value = (select = data[idx]).name;
                result.textContent = '';

                eClass.add('confirm-customer');
                cClass.remove('active');
                title.disabled = false;
            }
        });

        // ④ 제목 입력
        acceptKeys(title, (v) => {
            if (v.trim()) eClass.add('confirm-title');
            else eClass.remove('confirm-title');
        });

        // ⑤ 확인버튼
        confirmBtn.addEventListener('click', () => {
            if(eClass.contains('confirm-title') && eClass.contains('confirm-customer')) {
                let work = {customer: select.id, title: title.value};
                console.log(work);
            }

        });

        // ⑥ 취소버튼
        cancelBtn.addEventListener('click', () => this.off());


        // 초기화
        this.init = () => {
            result.textContent = title.value = search.value = '';
            title.disabled = true;
            eClass.remove('confirm-customer', 'confirm-title')
            cClass.remove('active');
        }

        this.init();
    }

    on() {
        this.init();
        this.element.classList.add('on');
        return this;
    }

    off() {
        this.element.classList.remove('on');
        return this;
    }
}