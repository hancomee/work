import {
    getElementById,
    getElementsByAttr,
    getElementsByClassName,
    getElementsByTagName,
    querySelectorAll
} from "../../lib/core/_dom/selector";
import {_compile} from "../../lib/core/_html/replaceHTML";
import {Lotto} from "./lotto";
import loop = Lotto.loop;


function radioBtns(ele: HTMLElement, handler: (v: string, not: string[]) => void) {

    let
        values: string[] = [],
        eles = querySelectorAll(ele, '[data-for]', (e, i, r) => {
            r[i] = e;
            values[i] = e.getAttribute('data-for');
        }, <HTMLElement[]>[]);

    ele.addEventListener('click', (e) => {

        let target = <HTMLElement>e.target;

        if (target.hasAttribute('data-for')) {
            if (!target.classList.contains('active')) {
                let attrVal = target.getAttribute('data-for');
                eles.forEach(v => {
                    if (v !== target) v.classList.remove('active');
                    else v.classList.add('active');
                });
                handler(attrVal, values.filter(v => v !== attrVal));
            }
        }
    });
}

class LottoE extends Lotto {

    element: HTMLElement

    disabled() {
        this.element.classList.add('disabled');
        return this;
    }

    active() {
        this.element.classList.remove('disabled');
        return this;
    }
}

let
    $data: LottoE[],

    display = getElementById('display'),
    main = getElementsByTagName('main', 0),
    nav = getElementsByTagName('nav', 0),
    aside = getElementsByTagName('aside', 0),

    t_selector = _compile(getElementById('selector-template').innerText),
    t_items = _compile(getElementById('item-template').innerText),
    t_graph = _compile(getElementById('nums-template').innerText),

    e_selector = getElementsByClassName('selector', 0),
    e_graph = getElementsByClassName('nums-graph', 0),

    c_graphs: { [index: number]: HTMLElement },

    logic = {

        select(n?: number[]) {
            if (n && n.length) {
                $data.forEach(lotto => {
                    if (lotto.check(n)) lotto.active();
                    else lotto.disabled();
                });
                loop((v) => {
                    if (n.indexOf(v) !== -1) c_graphs[v].classList.add('active')
                    else c_graphs[v].classList.remove('active')
                });
            } else {
                $data.forEach(v => v.active());
                loop((v) => c_graphs[v].classList.remove('active'));
            }
        },

        init(data: LottoE[]) {

            let max = 0, array = [], i = 45, html = [];
            while (i-- > 0) array[i] = 0;

            // 빈도수 체크
            data.forEach((d, i) => {

                html[i] = t_items(d);

                d.nums.forEach(n => {
                    array[n - 1]++;
                    if (max < array[n - 1]) max = array[n - 1];
                });
            });

            array = array.map((v, i) => {
                return {
                    num: i + 1,
                    length: v,
                    pecent: (v / max * 100)
                }
            });

            e_graph.innerHTML = t_graph(array);
            c_graphs = getElementsByAttr(e_graph, 'data-num');
            display.innerHTML = html.join('');

            getElementsByClassName(display, 'item', (e, i) => {
                data[i].element = e;
            });
            $data = data;
        }
    };


function $init(data: LottoE[]) {

    logic.init(data);

    // aside 선택부분
    e_selector.innerHTML = t_selector(Lotto.nTable);

    let
        type = 'number',
        selectArray = [],
        selNum: number,

        reset = getElementsByClassName(aside, 'reset', 0),
        sels = getElementsByAttr(e_selector, 'data-num'),

        handlers = {
            select() {
                if (type === 'number') logic.select([selNum]);
                else logic.select(selectArray);
            },
            reset() {
                main.removeAttribute('data-num');
                logic.select(null);
                selectArray = [];
                selNum = null;
                $data.forEach(v => v.active());
                loop((i) => sels[i].classList.remove('select', 'active'))
            },
            getNum(target) {
                let v = target.getAttribute('data-num');
                if (v === '') return 0;
                if (v) return parseInt(v);
                return -1;
            }
        };

    reset.addEventListener('click', handlers.reset);
    radioBtns(getElementsByClassName(aside, 'radio-btns', 0), (n, not) => {
        type = n;
        handlers.select();
    });

    e_selector.addEventListener('click', (e) => {
        let d = handlers.getNum(e.target);
        if (d > 0) {
            if (sels[selNum])
                sels[selNum].classList.remove('active')
            sels[selNum = d].classList.add('active');
            type === 'number' && handlers.select();
        }
    });

    // 선택
    e_selector.addEventListener('dblclick', (e) => {
        let d = handlers.getNum(e.target);

        if (d > 0) {
            let i = selectArray.indexOf(d);
            if (i === -1) {
                if (selectArray.length < 7) {
                    selectArray.push(d);
                    sels[d].classList.add('select');
                }
            }
            else {
                selectArray.splice(i, 1);
                sels[d].classList.remove('select');
            }
            type !== 'number' && handlers.select();
        }
    })

    // nav이벤트
    let {classList} = display;
    radioBtns(getElementsByClassName(nav, 'radio-btns', 0), (n, not) => {
        classList.remove.apply(classList, not);
        classList.add(n);
    });
}

Lotto.$data().then(v => $init(v.map(a => new LottoE(a))));


