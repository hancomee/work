/*
 *   ① 버튼에 data-toggle="dropdown"을 반드시 기입해야 작동한다.
 *
 *   ② .dropdown 엘리먼트 옵션
 *       [data-toggle-class="class:select; class:select; class:this"]
 *      상위 부모나 버튼 자체에 특정 클래스를 기입해준다.
 *       !class는 없앤다는 표식
 *
 *       .dropdown 엘리먼트에 설정하는 이유는 actives로 이를 전부 저장하고 있기때문. 삭제할때 용이
 */
(function () {

    if (window['___toggle-on___']) return;
    window['___toggle-on___'] = true;

    type E = HTMLElement;


    const
        indexOf = Array.prototype.indexOf,
        toggleActive = document.getElementsByClassName('toggle-active'),
        actives = document.getElementsByClassName('dropdown-open'),
        activeBtns = document.getElementsByClassName('toggle-dropdown-btn'),


        // [data-toggle-class]
        r_split = /;\s*/g,
        __classHandler = (ele, isAdd = true) => {
            const str = ele.getAttribute('data-toggle-class');
            if (str) {
                str.split(r_split).forEach(line => {
                    let [c, s] = line.split(':'),
                        target = s === 'this' ? ele : ele.closest(s),
                        adder = isAdd;

                    if (c[0] === '!') {
                        c = c.slice(1);
                        adder = !isAdd;
                    }

                    adder ? target.classList.add(c) : target.classList.remove(c);
                });
            }
        },

        // 첫번째 클릭이벤트를 무력화시키기 위한 핸들러
        __dispatcher = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            e.target.removeEventListener('click', __dispatcher);
        },


        __closest = (e, key: string, limit = 3): E => {
            do {
                if ((e.getAttribute('data-toggle') || '').indexOf(key) === 0) return e as E;
            } while ((e = e.parentElement) && limit-- > 0);
            return null;
        },


        // 다른 data-toggle 이벤트에서도 사용할 수 있게…
        __closeDropdown = (dropdown?) => {
            let l = actives.length, i;
            if (l) {
                while (l-- > 0) {
                    if (!dropdown || !actives[l].contains(dropdown)) {
                        i = activeBtns.length;
                        while (i-- > 0) {
                            if (actives[l].contains(activeBtns[i])) {
                                __classHandler(activeBtns[i], false);
                                activeBtns[i].classList.remove('dropdown-open-btn');
                            }
                        }
                        actives[l].classList.remove('dropdown-open');
                        //actives[l].classList.remove('toggle-dropdown');
                    }
                }
            }
        },


        $$events = {

            mousedown: {

                /*
                2022-06-05 작성
                삭제버튼을 사용함에 있어
                첫번째 클릭시 의사확인 후
                다시 클릭할때 삭제동작이 이루어지도록 한다.
                */
                dblclick(e: MouseEvent) {

                    let target = e.target as HTMLElement,
                        chk = target.getAttribute('data-toggle') === 'dblclick',
                        list = document.getElementsByClassName('toggle-dblclick-active'),
                        l = list.length;

                    if (target.closest('.toggle-dblclick-active')) return;

                    while (l-- > 0) {
                        if (list[l].getAttribute('data-toggle') === '!dblclick') {
                            list[l].setAttribute('data-toggle', 'dblclick');
                            __classHandler(list[l], false);
                            list[l].classList.remove('toggle-dblclick-active');
                        }
                    }

                    if (chk) {
                        target.addEventListener('click', __dispatcher);     // ★★핵심로직 클릭이벤트를 한번 막는다
                        target.setAttribute('data-toggle', '!dblclick');
                        __classHandler(target, true);
                        __closeDropdown(target);  // 열려있는 드랍다운이 있다면 닫히게 한다.
                        target.classList.add('toggle-dblclick-active');
                    }
                }
            },


            click: {

                toggle(e: MouseEvent) {

                    let target = __closest(e.target, 'toggle')

                    if(target) {
                        let flag = !target.classList.contains('toggle-active');
                        __classHandler(target, flag);
                        if(flag) {
                            target.classList.add('toggle-active');
                        }
                        else {
                            target.classList.remove('toggle-active');
                        }
                    }
                },

                dropdown(e: MouseEvent) {
                    let
                        btnEle: HTMLElement,
                        ele = btnEle = <HTMLElement>e.target,

                        limit = actives.length ? 10 : 3,    // 열려진게 있으면 dismiss 조사를 위해 끝까지 타고 올라가고 아니면 3개까지만.
                        dropdown: HTMLElement,
                        btn: boolean,
                        dismiss: boolean;

                    if (!document.contains(ele)) return;

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
                            if (indexOf.call(actives, dropdown) === -1) {
                                __classHandler(btnEle, true);
                                btnEle.classList.add('toggle-dropdown-btn');
                                dropdown.classList.add('dropdown-open');
                                //dropdown.classList.add('toggle-dropdown');
                            } else dropdown = btnEle = null;
                        } else if (dismiss) dropdown = btnEle = null;  // 아래에서 다 지운다.
                    }

                    __closeDropdown(dropdown);
                }
            },

        };


    // attach Event
    for (let p in $$events) {
        for (let v in $$events[p]) {
            document.addEventListener(p, $$events[p][v]);
        }
    }

})();




