import {__className, __hasClass} from "../_dom/_commons";


(function () {

    if (window['___toggle-on___']) return;
    window['___toggle-on___'] = true;

    let
        indexOf = Array.prototype.indexOf,
        actives = document.getElementsByClassName('dropdown-open');

    // 사용자 클릭 이벤트
    document.addEventListener('click', (e) => {

        let ele = <HTMLElement>e.target,

            limit = actives.length ? 10 : 3,    // 열려진게 있으면 dismiss 조사를 위해 끝까지 타고 올라가고 아니면 3개까지만.
            dropdown: HTMLElement = e['dropdown_skip'],
            btn: boolean,
            dismiss: boolean;

        /*
         * 이벤트 객체에 dropdownTarget을 등록하면 disable 대상에서 제외시켜준다.
         */
        if(!dropdown) {
            // 순회
            do {
                if ((ele.getAttribute('data-toggle') === 'dropdown') && !ele.classList.contains('disabled')) btn = true;
                if (ele.hasAttribute('data-dismiss')) dismiss = true;
                if (ele.classList.contains('dropdown')) {
                    dropdown = ele;
                    break;
                }
            } while ((ele = ele.parentElement) && limit-- > 0);

            if (dropdown) {

                if (btn) {
                    if (indexOf.call(actives, dropdown) === -1)
                        dropdown.classList.add('dropdown-open');
                    else dropdown = null;
                } else if (dismiss) dropdown = null;  // 아래에서 다 지운다.
            }
        }

        let l = actives.length;
        if(l) {
            let event = document.createEvent('Event');
            event.initEvent('dropdown.close', false, true);
            while (l-- > 0)
                if(actives[l] !== dropdown) {
                    actives[l].dispatchEvent(event);
                    actives[l].classList.remove('dropdown-open')
                }
        }

    });
})();


