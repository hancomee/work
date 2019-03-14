import {
    getElementById,
    getElementsByAttr,
    getElementsByClassName,
    getElementsByTagName, querySelectorAll
} from "../../lib/core/_dom/selector";
import {_compile} from "../../lib/core/_html/replaceHTML";
import {DataTable} from "./data-table/_DataTable";
import {DOM} from "../../lib/core/dom";
import {$delete, $get, $post, $put} from "./_core/_ajax";
import {Receivable} from "./data-table/receivable";
import {Search} from "../../lib/core/location";
import {Forms} from "../../lib/core/form/Forms";
import {Events} from "../../lib/core/events";
import {_remap} from "../../lib/core/_util/remap";
import {SelectCalendar} from "../../lib/core/component/SelectCalendar";
import {Formats} from "../../lib/core/format";
import {FormEvent} from "../../lib/core/form/FormEvent";
import {_orders} from "../../lib/core/_util/_orders";
import createHTML = DOM.createHTML;
import dataEvent = Events.dataEvent;
import toDate = Formats.toDate;
import numbers = FormEvent.numbers;
import className = DOM.className;
import {BankAccount} from "./data-table/bankAccount";
import {Pager} from "../../lib/core/component/Pager";
import {selectAll} from "../../lib/core/_dom/_select";
import {ModifyForm} from "./_support/ModifyForm";
import {ConfirmBox} from "./_support/ComfirmBox";

type H = HTMLElement
type OnLoadHandler = (values: ServerData<any>, query: DataSearch, key: string) => void

let

    $ajax = {
        list(table: string, data: DataSearch): Promise<ServerData<any>> {
            return $post('/datatable/list/' + table, data);
        },

        save(table: string, data) {
            return $put('/datatable/save/' + table, data);
        },

        remove(table: string, id) {
            return $delete('/datatable/remove/' + table + '/' + id);
        }
    },

    ctrlContainer = getElementsByClassName('data-ctrl', 0),
    tabsContainer = getElementsByClassName('container-tabs', 0),
    container = getElementById('data-table'),

    // template functions
    headerTemple = _compile(getElementById('table-header-template').innerText),
    bodyTemple = _compile(getElementById('table-body-template').innerText),
    formTemple = _compile(getElementById('form-template').innerText),

    $confirm = new ConfirmBox(document.getElementById('confirm-box')),

    // searchList
    searchList = _compile('<li class="{{_.check ? \'active\' : \'\'}}" ::>' +
        '<span data-key="{{_.key}}" data-dismiss="{{_.title}}">{{_.title}}</span></li>'),

    // type:list
    createList = (function ($com) {
        let ul = <HTMLUListElement>createHTML('<ul class="dropdown-box dropdown-list"></ul>', true);
        return (list: string[], current) => {
            ul.innerHTML = $com(list, current);
            return ul;
        }
    })(_compile('<li class="{{_ === $.value ? \'active\' : \'\'}}" data-dismiss="{{_}}" ::>{{_}}</li>')),

    // type:date
    calendar = new SelectCalendar().$element((e, c) => {
        e.classList.add('dropdown-box');
    }),

    // input pre processor
    inputTypes = _remap({

        number: numbers,
        numeric: 'number',
        list(input: HTMLInputElement, item: DataTable, form: Forms) {
            let {parentElement, name} = input, {list} = item.headers[name];
            input.setAttribute('data-toggle', 'dropdown');
            parentElement.addEventListener('dropdown.on', (e) => {
                parentElement.appendChild(createList(list, {value: input.value}))
            });

            parentElement.addEventListener('click', (e) => {
                let v = e.target['getAttribute']('data-dismiss');
                if (v) {
                    input.value = v;
                    form.valid();
                }
            })
        },


        /*
         *  달력을 띄우기 위해 dropdown 설정을 한다.
         */
        date(input: HTMLInputElement, item: DataTable, form: Forms) {

            let {parentElement} = input,
                handler = (date) => input.value = date;

            input.setAttribute('data-toggle', 'dropdown');
            parentElement.addEventListener('dropdown.on', (e) => {
                calendar.create(toDate(input.value)).appendTo(parentElement).onSelect = handler;
            })
        },
        datetime: 'date'
    });

interface DataSearch extends Search, DataQuery {
}

type SearchItem = { key: string, title: string };

class DataItem {

    private _searchList: SearchItem[]

    table: HTMLElement
    tbody: HTMLElement
    orders: HTMLElement[]
    form: Forms
    query: DataSearch
    names: string[] = []
    searchKey: string


    constructor(public item: DataTable) {


        let {headers, table} = item,
            query = this.query = <DataSearch>new Search().extend(item.query),
            tableElement = this.table = createHTML(headerTemple(item), true),
            thead = getElementsByTagName(tableElement, 'thead', 0),
            names = this.names = Object.getOwnPropertyNames(headers),
            searchList = this._searchList = [];

        this.orders = querySelectorAll(tableElement, '[data-order-value]');
        this.tbody = getElementsByTagName(tableElement, 'tbody', 0);


        /*
         *  text타입은 모두 search 대상이 된다.
         */
        names.forEach((v, i) => {
            if (headers[v].type === 'text' || headers[v].type === 'numeric') {
                if (searchList.push({key: v, title: headers[v].title}) === 1)
                    this.searchKey = v;
            }
        });

        // order 순서변경
        thead.addEventListener('click', (e) => {
            let target = <HTMLElement>e.target,
                key = target.getAttribute('data-order-value');
            if (key) {
                query.order = _orders(key, target.getAttribute('data-order') === 'desc');
                query.page = 1;
                location.hash = table + '?' + query.toString();
            }
        });

        this.form = new ModifyForm(createHTML(formTemple(headers)))
            .$element((element, forms) => {
                getElementsByAttr(element, 'data-type',
                    (r, e: HTMLInputElement, v) =>
                        inputTypes[v] && !e.readOnly && inputTypes[v](e, item, forms));
            });
    }

    setOrder(v: string) {
        let {orders, names} = this,
            [type, prop] = _orders(v);

        names.forEach((v, i) => {
            orders[i].setAttribute('data-order', v === prop ? type : '');
        });
    }

    run(val?) {
        location.hash = this.item.table + '?' + this.query.extend(val).toString()
        return this;
    }


    searchList(key: string, list: H, btn: H) {
        let {_searchList, searchKey} = this;

        if (!key) key = searchKey;

        btn.textContent = this.item.headers[this.searchKey = key].title;
        list.innerHTML = searchList(_searchList.map(v => {
            v['check'] = key === v.key
            return v;
        }));
    }

    onLoad(values: ServerData<any>) {
        this.setOrder(this.query.order);
    }
}

class DataManager {

    private values: { [index: string]: DataTable } = {}

    private items: { [index: string]: DataItem } = {}
    private names: string[] = []
    private _onLoad: OnLoadHandler[] = [];

    key: string
    contents: any[]
    obj: DataItem


    constructor(items: DataTable[]) {
        let

            values = this.values,
            names = this.names,
            $$onLoad = this._onLoad, i = 0,
            pager = new Pager(getElementsByClassName('data-ctrl-pager', 0), 5, 5)
                .setHandler((page) => this.obj.run({page: page})),
            tableName: string;

        // pager 갱신
        $$onLoad[i++] = ({page, totalPages}) => pager.render(page, totalPages)

        tabsContainer.innerHTML = items.map((item, i) => {
            tableName = names[i] = item.table;
            values[tableName] = item;
            return '<li data-table="' + tableName + '">' + item.name + '</li>';
        }).join('');

        tabsContainer.addEventListener('click', (e) => {
            let table = e.target['getAttribute']('data-table');
            if (table) this.getItem(table).run();
        });

        // 탭 갱신
        $$onLoad[i++] = ((tabs) => {
            return (_, __, key) => {
                names.forEach((v, i) => className(tabs[i], 'active', key === v));
            }
        })(querySelectorAll(tabsContainer, '[data-table]'))

        // dataEvent
        dataEvent(getElementsByClassName('container-table', 0), 'click', 'data-form', this);

        // hashchange
        window.addEventListener('hashchange', () => this.run(location.hash));

        selectAll(ctrlContainer,
            ['class="data-ctrl-search"[0]', ':0 class="data-ctrl-search-before"[0]',
                ':1 tag="span"[0]', ':1 class="dropdown-list"[0]', ':0 tag="input"[0]'],
            (container: H, dropdown: H, btn: H, list: H, input: HTMLInputElement) => {

                let render = (key) => this.obj.searchList(key, list, btn);

                list.addEventListener('click', (e) => {
                    let key = e.target['getAttribute']('data-key');
                    if (key) render(key);
                });

                input.addEventListener('keyup', (e) => {
                    if (e.keyCode === 13) {
                        if (input.value) {
                            let contains = {};
                            contains[this.obj.searchKey] = input.value;
                            this.obj.run({contains: contains, page: 1});
                        }
                        else {
                            this.obj.run({contains: null, page: 1});
                        }
                    }
                });

                $$onLoad[i++] = (values, {contains}) => {
                    let key, val = '';
                    for (key in contains) {
                        val = contains[key];
                        break;
                    }
                    render(key);
                    input.value = val;
                };
            })
    }


    getItem(tableName: string) {
        let obj = this.items[tableName];
        if (!obj) obj = this.items[tableName] = new DataItem(this.values[tableName]);
        return obj;
    }

    run(hash: string) {

        if (hash[0] === '#') hash = hash.slice(1);

        let i = hash.indexOf('?'),
            key: string;

        if (i === -1) i = hash.length;
        key = hash.substring(0, i);

        if (this.key !== key) {
            let obj = this.getItem(key);
            this.obj = obj;
            this.key = key;
        }

        Search.toObject(hash.slice(i + 1), this.obj.query);

        return this.$load();
    }

    private $load(query = this.obj.query) {

        let {key, obj, obj: {table, tbody, item}} = this;

        $ajax.list(key, query).then(values => {
            let $contents = this.contents = values.contents.map(v => item.toValue(v)),
                no = {total: values.totalElements - ((values.page - 1) * values.size)}

            container.textContent = '';
            tbody.innerHTML = bodyTemple($contents.map(v => item.converter(v)), no);
            container.appendChild(table);

            // onload 핸들러
            this._onLoad.forEach(handler => handler(values, query, key));
            obj.onLoad(values);
        })

        return this;
    }


    // dataEvent Method
    create() {
        let {form, form: {element}, tbody} = this.obj;
        element.setAttribute('data-value', 'index:-1');
        element.classList.remove('modify-form');
        form.reset().valid();
        tbody.insertBefore(element, tbody.firstChild);
    }

    confirm({index}: any) {
        if (index !== -1) {

            $ajax.save(this.key, this.obj.form.values()).then(() => this.$load());
        } else {
            let values = this.obj.form.values();
            delete values['id'];
            $ajax.save(this.key, values).then(() => this.$load());
        }
    }

    remove({index, event}: any) {
        let tr = event.target.parentElement.parentElement;
        if ($confirm.eventTarget !== tr) {
            event.stopPropagation()
            $confirm.on(event.pageX, tr, event.target, (flag) => {
                if (flag)
                    $ajax.remove(this.key, this.contents[index]['id']).then(() => this.$load())
            })
        }

    }

    modify({target, index}: any) {
        let {form, form: {element}} = this.obj;
        element.setAttribute('data-value', 'index:' + index);
        element.classList.add('modify-form');
        form.reset(this.contents[index]).valid()
        form.prepend(target);
    }
}


let $manager = new DataManager([new Receivable(), new BankAccount()])
    .run(location.hash ? location.hash : 'receivable');
