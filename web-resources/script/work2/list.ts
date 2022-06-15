import "../../lib/core/_event/_toggle";
import {Search} from "../../lib/core/support/Search";
import {$delete, $post, __appendFragment} from "./_support/_util";
import {CUSTOMER, ListData} from "./_types";
import {Template} from "../../lib/core/_dom/_template";
import {Events} from "../../lib/core/_events";
import __$attrEvent = Events.__$attrEvent;
import {Pager} from "../../lib/core/component/Pager";
import {Customer} from "../work/_core/Work";
import {__remap} from "../../lib/core/_util/_remap";

type E = HTMLElement;
type A = HTMLAnchorElement;
type T = HTMLTextAreaElement;
type I = HTMLInputElement;

const $state = '작업대기 시안검토 시안완료 작업중 입고 납품 완료'.split(' '),
    {forEach, indexOf} = Array.prototype;

class ListManager extends Search {

    $data: ListData

    duration = 'all'
    size = 12
    page = 1
    state = 0
    search: string
    searchType = 'customerName'
    orders = '<this.datetime'

    reset() {
        super.reset(location.hash.substring(1));
        return this;
    }

}

@Template('&info', false)
class Info {
    static $create: (data?) => Info

    name: string
    pager: Pager

    constructor(
        public element: E,
        public navTable: E,
        public search: ListManager
    ) {
        this.pager = new Pager(element, 5, 4);
    }

    apply() {
        this.name = $state[this.search.state];
        return this;
    }
}

@Template('&stateList')
class StateList {
    static $create: (data?) => StateList

    constructor(public element: E, public data, public search: ListManager) {
    }

    apply(data) {
        let {index} = this.data = data,
            {state} = this.search;
        if (index === state) this.element.classList.add('active');
        else this.element.classList.remove('active');
        return this;
    }
}

@Template('&itemList')
class ItemList {
    static $create: (data?) => ItemList

    constructor(public element: E, public data, public search: ListManager) {
    }

    apply() {
        return this;
    }
}

// 작업 생성
@Template('&workCreator', false)
class WorkCreator {
    static $create: (data?) => WorkCreator

    constructor(public element: E,
                public customer: I,
                public title: I,
                public resultList: E
    ) {

        // 화면 끄기
        element.addEventListener('mousedown', (e) => e.target === element && this.off());

        let keyword;

        const
            {classList} = element,

            __getNames = (val = customer.value) => {
                fetch('/work/db/customer/' + encodeURIComponent(val)).then(res => res.json()).then((list: CUSTOMER[]) => {
                    if (val === keyword) {
                        let creatable = true;
                        resultList.innerHTML = list.map((data, i) => {
                            creatable &&= !(data.name === val);
                            return '<li data-id="' + data.id + '" data-name="' + data.name + '"><span>' + data.name + '</span></li>'
                        }).join('');
                        creatable ? classList.add('creatable') : classList.remove('creatable');
                    }
                })
            },

            $creator = {
                customer() {
                    $post('/work/db/customer', {name: customer.value}).then(res => __getNames());
                },
                work() {
                    $post('/work/db/create',
                        {'customer_id': element.getAttribute('data-customer'), title: title.value})
                        .then(res => res.json())
                        .then(uuid => location.href = '/work/view/' + uuid)
                }
            };


        // 버튼 클릭
        element.addEventListener('click', (e) => {
            let func = $creator[(e.target as E).getAttribute('data-creator')];
            func && func();
        });


        // 고객이름 입력
        customer.addEventListener('keyup', (e: KeyboardEvent) => {

            const
                value = customer.value = customer.value.trim(),
                {key} = e;

            if (!value) {
                classList.remove('creatable');
                resultList.textContent = keyword = '';
                return;
            }

            // 리스트 선택
            if (key === 'Enter') {
                let target = resultList.getElementsByClassName('selected')[0];
                if (target) {
                    this.setCustomer(target.getAttribute('data-id'), target.getAttribute('data-name'));
                    keyword = '';
                }
            }
            // 리스트 이동
            else if (key.indexOf('Arrow') === 0) {

                let list = resultList.getElementsByTagName('li'),
                    selected = resultList.getElementsByClassName('selected')[0],
                    target,
                    len = list.length,
                    index = indexOf.call(list, selected);

                if (key === 'ArrowDown') {
                    if (index === -1) {
                        if (len) target = list[0];
                    } else if (index < len - 1) {
                        selected.className = '';
                        target = list[index + 1];
                    }
                } else if (key === 'ArrowUp') {
                    if (index > 0) {
                        selected.className = '';
                        target = list[index - 1];
                    }
                }

                if (target) {
                    target.className = 'selected';
                }


            } else {

                element.removeAttribute('data-customer');

                if (value !== keyword && value) {
                    __getNames(keyword = value);
                }
            }
        });

        // 작업 생성 버튼
        title.addEventListener('keyup', (e) => {
            let val = title.value.trim();
            val ? element.classList.add('confirm') : element.classList.remove('confirm');
            if (e.key === 'Enter' && val) $creator.work();
        })

        element.addEventListener('click', (e) => {
            let target = (e.target as E).closest('[data-name]');
            if (target) this.setCustomer(target.getAttribute('data-id'),
                target.getAttribute('data-name'));
        });
    }

    setCustomer(id, name) {
        this.customer.value = name;
        this.element.classList.remove('creatable');
        this.element.setAttribute('data-customer', id);
        this.resultList.textContent = '';
        this.title.focus();
        return this;
    }


    on() {
        this.reset().element.classList.add('on');
        this.customer.focus();
        return this;
    }

    off() {
        this.element.classList.remove('on');
    }

    private reset() {
        this.customer.value = this.title.value = this.resultList.textContent = '';
        this.element.removeAttribute('data-customer');
        this.element.classList.remove('creatable');
        return this;
    }

    apply() {
        return this;
    }
}


(function () {

    const


        search = new ListManager().resetHash(),

        $stateElement = document.getElementById('state'),
        $container = document.getElementById('container'),

        // 엔터로 동작하기
        $search = ((input) => {
            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') document.getElementById('searchBtn').click();
            });
            return input;
        })(document.getElementById('search') as I),

        workCreator = WorkCreator.$create(),
        info = Info.$create({search: search}).apply(),
        stateList = $state.map(() => StateList.$create({search: search})),


        // 데이터 가져오기
        __render = () => {
            $post('/work/list?' + search.reset().toString(), null).then(res => res.json()).then((values: ListData) => {
                let {contents, price, count, today, page, totalPages} = values;


                // 리스트 갱신
                stateList.forEach((v, i) => v.apply({
                    index: i,
                    name: $state[i],
                    count: count[i],
                    price: price[i],
                    today: today[i]
                }));

                info.pager.render(page, totalPages);
                info.apply();
                $stateElement.appendChild(__appendFragment(stateList));

                $container.textContent = '';
                $container.appendChild(__appendFragment(
                    contents.map(value => ItemList.$create({data: value}).apply())
                ));
            });
        };


    //
    const keyEvent = __remap({
        Enter() {
            workCreator.element.classList.contains('on') || workCreator.on();
        }
    });
    document.addEventListener('keyup', (e: KeyboardEvent) => e.target === document.body && keyEvent[e.key] && keyEvent[e.key](e));

    __$attrEvent(document.body, 'click', 'data-event', class {

        id: number
        page: number
        uuid: string
        state: number
        stateList: StateList
        itemList: ItemList

        _template(e) {
            this[e.getAttribute('_template')] = Template.get(e);
        }

    }, {
        moveState({state}) {
            search.writeHash({state: state, page: 1});
        },
        view({uuid}) {
            location.href = '/work/view/' + uuid;
        },
        pageMove({page}) {
            page && search.writeHash({page: page});
        },
        changeState({state, id}) {
            $post('/work/db/update/state/' + id + '/' + state, null).then(res => {
                __render();
            });
        },
        search() {
            let value = $search.value = $search.value.replace(/\s/g, '');
            if (value) search.writeHash({search: value, page: 1});
            else search.writeHash({search: null});
        },
        createWork() {
            workCreator.on();
        },
        removeWork({itemList}) {
            $delete('/work/db/remove/' + itemList.data.id).then(res => {
                __render()
            });
        }
    })

    __render();
    window.addEventListener('hashchange', __render);

})()