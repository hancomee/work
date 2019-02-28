import "../../lib/core/component/toggle";
import {Work} from "./_core/Work";
import {Search} from "../../lib/core/location";
import {Mapping} from "./_support/Mapping";
import {_everyTrue, _forEach, _range} from "../../lib/core/_func/array";
import {DOM} from "../../lib/core/dom";
import {
    getElementById,
    getElementsByAttr,
    getElementsByClassName,
    getElementsByTagName,
    querySelector
} from "../../lib/core/_dom/selector";
import {selectAll} from "../../lib/core/_dom/_select";
import {_replaceHTML} from "../../lib/core/_html/replaceHTML";
import {WorkCreator} from "./list/WorkCreator";
import className = DOM.className;
import WorkListValue = Work.WorkListValue;

class ListManager extends Search {

    $data: ListData<WorkListValue>

    duration = 'all'
    size = 8
    page = 1
    state = 0
    search: string
    searchType = 'customerName'
    orders = '<work.datetime'

    reset() {
        super.reset(location.hash.substring(1));
        return this;
    }

    run(obj: string)
    run(obj)
    run(v) {
        location.hash = this.extend(
            typeof v === 'string' ? Search.toObject(v) : v
        ).toString();
        return this;
    }
}


let
    main = getElementsByTagName(document.body, 'main', 0),

    $alert: Array<(manager: ListManager, query: string) => void> = [],
    $resetIndex = 0,

    $directive = {

        // 시안파일 background-image 적용하기
        draft(ele: HTMLAnchorElement, v: WorkListValue) {
            let {work, work: {uuid}} = v;
            if (v.draft) {
                let path = Work.toPath(uuid);
                ele.style.backgroundImage = 'url("/workdata/' +
                    path + v.draft.getSaveName() +
                    '")'
            }
            ele.href = "/work/view/" + work.uuid;
        },

        // 제목에 href 달기
        title(ele: HTMLAnchorElement, v: Work) {
            ele.textContent = v.title;
            ele.href = "/work/view/" + v.uuid;
        },

        // 각 work-list에 state 선택용 드랍다운 만들어달기
        state: ((stateObj) => {
            let ff = _replaceHTML(document.getElementById('stateList').innerText);

            return (ele: HTMLElement, work: Work) => {
                selectAll(ele,
                    ['= [data-toggle="dropdown"]', '<0> ul'],
                    (btn: HTMLElement, ul: HTMLUListElement) => {
                        btn.textContent = stateObj[work.state];
                        ul.innerHTML = _range(0, 7, (v, r) => {
                            stateObj.index = v;
                            r[v] = ff(work, null, stateObj);
                        }, []).join('')
                    })
            }
        })(((s) => s.reduce((r, v, i) => (r[i] = v, r), {index: -1}))(Work.$state)),
    },

    $manager = new ListManager(),   // url 쿼리 오브젝트
    $mapping = new Mapping()
        .addDirective($directive)
        .addTemplate(document.head)
        .addHTML(document.head),

    // 로딩
    limit = 2,
    $load = () => {
        let query = $manager.reset().toString();
        Work.list(query).then(v => {

            // 데이터가 없고, 1page가 아닐 경우 최대 2번까지 페이지를 줄이면서 재로딩한다.
            if (!v.contents.length && $manager.page > 1) {
                if (limit) {
                    limit--;
                    $manager.run({page: $manager.page - 1});
                }
                else $manager.run({page: 1});
                return;
            }

            limit = 2;
            $manager.$data = v;

            query = decodeURIComponent(query);
            $mapping.setData(v).$render(main);
            $alert.forEach(v => v($manager, query));
        })
    },

    /*
     *  data-pre-processor 적용된 엘리먼트 전처리 작업
     */
    $preProcessor = {

        /*
         *   데이터 로딩시마다, [data-load]를 가진 엘리먼트들의 active 여부를 확인해준다.
         */
        main(ele: HTMLElement) {
            let cName = ['active'];

            $alert[$resetIndex++] = (manager, query) => {
                // data-load == active 갱신
                _forEach(document.body.querySelectorAll('[data-load]'), (e) => {
                    // [data-load-match]를 우선시한다.
                    let match = e.getAttribute('data-load-match') || e.getAttribute('data-load'),
                        r = _everyTrue(match.split("&"), (v) => query.indexOf(v) !== -1);
                    className(e, cName, r);
                });
            };
        },

        // 작업 추가
        create(ele: HTMLElement) {
            let create = new WorkCreator(getElementById('work-creator'));
            ele.addEventListener('click', () => {
                create.on();
            })
        },

        // 페이지 네비게이션
        pager(ele: HTMLElement) {
            let cName = ['active'],
                [prev, btn, next] = selectAll(ele,
                    ['"0" ctrl-pager-prev', '= [data-toggle="dropdown"]', '"0" ctrl-pager-next']),
                $page = -1;

            $alert[$resetIndex++] = (manager, query) => {
                let {$data: {page, totalPages, size}} = manager;
                btn.textContent = page + ' / ' + totalPages;
                className(prev, cName, page > 1);
                className(next, cName, page < totalPages);
                $page = page;
            };

            ele.addEventListener('click', (e) => {
                e.stopPropagation();
                let target = <HTMLElement>e.target,
                    move = target.getAttribute('data-move');
                if (move && target.classList.contains('active')) {
                    $manager.run({page: $page + parseInt(move)});
                }
            });
        },


        // 문자열 검색
        search(ele: HTMLElement) {
            let
                searchTypes = {
                    customerName: '거래처명',
                    title: '제목명',
                    itemSubject: '품목명',
                    print: '인쇄파일명',
                    ref: '참고파일명',
                },

                input = <HTMLInputElement>getElementsByTagName(ele, 'input', 0),

                // 위의 searchTypes 따라 직접 dropdown 리스트를 만든다.
                menus = ((dropdown: HTMLElement) => {
                    let html = [];
                    for (let p in searchTypes)
                        html.push('<div data-dismiss="' + p + '">' + searchTypes[p] + '</div>');
                    dropdown.innerHTML = html.join('');
                    return dropdown.querySelectorAll('[data-dismiss]');
                })(getElementsByClassName(ele, 'dropdown-menu', 0)),

                btn = querySelector(ele, '[data-toggle="dropdown"]');

            ele.addEventListener('click', (e) => {
                let target = <HTMLElement>e.target, type;
                if (type = target.getAttribute('data-dismiss')) {
                    btn.textContent = searchTypes[$manager.searchType = type];
                }
            });

            // 검색어 입력 후 엔터!
            input.addEventListener('keyup', (e: KeyboardEvent) => {
                if (e.keyCode === 13) {
                    let value = input.value.trim();
                    if (value) $manager.run({
                        search: value,
                        page: 1
                    })
                    else $manager.run({
                        search: null,
                        page: 1
                    })
                }
            })

            // rendering 될때마다 input값 확인
                $alert[$resetIndex++] = () => {
                let {searchType} = $manager;
                btn.textContent = searchTypes[searchType];
                input.value = $manager.search || '';
                _forEach(menus, (e) => {
                    className(e, ['active'], e.getAttribute('data-dismiss') === searchType);
                });
            };
        },

        // 각 작업의 state 드랍다운
        work(ele: HTMLElement) {
            ele.addEventListener('click', (e) => {
                let target = <HTMLElement>e.target,
                    s = target.getAttribute('data-state')
                if (s && target.className.indexOf('active') === -1) {
                    let [id, state] = s.split(':');
                    Work.updateState(id, state).then(() => $load());
                }
            });
        }
    };


getElementsByAttr(document.body, 'data-pre-processor', $preProcessor);

document.addEventListener('click', (e) => {
    let target = <HTMLElement>e.target;
    while (target) {
        if (target.hasAttribute('data-load')) {
            $manager.run(target.getAttribute('data-load'));
            return;
        }
        target = target.parentElement;
    }
});

window.addEventListener('hashchange', $load);
$load();





