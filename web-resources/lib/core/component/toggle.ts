import {DOM} from "../dom";

import className = DOM.className;
import hasClass = DOM.hasClass;

let
    r_dropdown = ['dropdown'],
    r_open = ['show', 'open'],

    active: HTMLElement,

    act = (dropdown: HTMLElement, flag: boolean, e: Event) => {
        let eventType;

        className(dropdown, r_open, flag);
        className(dropdown.getElementsByClassName('dropdown-menu')[0], r_open, flag);

        // dropdown 이벤트
        if ((eventType = dropdown.getAttribute('data-dropdown-event')) != null) {
            let event = document.createEvent('Event');
            event.initEvent(eventType, true, true);
            event['data'] = {isOpen: flag, dropdown: dropdown, target: e.target};
            dropdown.dispatchEvent(event);
        }


        if (flag) active = dropdown;
        else active = null;
    };

(function () {

    // 열기 커스텀 이벤트
    document.addEventListener('dropdown-open', (e) => {
        let ele = <HTMLElement>e.target;
        while (ele) {
            if (hasClass(ele, r_dropdown)) {
                if (active !== ele) {
                    active && act(active, false, e);
                    act(ele, true, e);
                }
                return;
            }
            ele = ele.parentElement;
        }
    });

    // 닫기 커스텀 이벤트
    document.addEventListener('dropdown-close', (e) => {
        if (active) {
            let ele = <HTMLElement>e.target;
            while (ele) {
                if (hasClass(ele, r_dropdown)) {
                    if (ele === active)
                        act(ele, false, e);
                    return;
                }
                ele = ele.parentElement;
            }
        }
    });

    // 사용자 클릭 이벤트
    document.addEventListener('click', (e) => {

        let ele = <HTMLElement>e.target,

            dropdown: HTMLElement,
            btn: boolean,
            dismiss = btn = ele.getAttribute('data-toggle') === 'dropdown';

        if (!active && !btn)
            return;

        // 순회
        do {
            // dropdown 찾기
            if (hasClass(ele, r_dropdown)) {
                dropdown = ele;
                break;
            }
            // 끄기 버튼
            else if (ele.hasAttribute('data-dismiss'))
                if (ele.getAttribute('data-dismiss') === 'false')
                    return
                else
                    dismiss = true;

        } while (ele = ele.parentElement);

        // 현재 활성화된게 있고, 찾은 dropdown과 다르다면 무조건 끈다.
        // dropdown을 못찾았을 경우에도 끄게 된다.
        if (active && active !== dropdown) act(active, false, e);


        // ① dropdown 객체를 찾았을때
        if (dropdown) {

            // 현재 열려져있다면 dismiss 체킹이 되어있을때만 없앤다.
            if (hasClass(dropdown, r_open)) {
                dismiss && act(dropdown, false, e);
            }
            // 아니라면 btn을 클릭했을 경우에만 켠다.
            else {
                btn && act(dropdown, true, e);
            }
        }

    });
})();
