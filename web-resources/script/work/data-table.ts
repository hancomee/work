import {__findAll, __findByAttr, __findByClass, __findById, __findByTag} from "../../lib/core/_dom/_selector";
import {$delete, $post, $put} from "../../lib/core/_ajax";
import {Receivable} from "./data-table/receivable";
import {Events} from "../../lib/core/_events";
import {SelectCalendar} from "../../lib/core/component/SelectCalendar";
import {FormEvent} from "../../lib/core/_form/_formEvents";
import {__orders} from "../../lib/core/_util/_orders";
import {BankAccount} from "./data-table/bankAccount";
import {Pager} from "../../lib/core/component/Pager";
import {__selectA} from "../../lib/core/_dom/_select";
import {ModifyForm} from "./_support/ModifyForm";
import {ConfirmBox} from "./_support/ComfirmBox";
import {$extend} from "../../lib/core/_core";
import {__compileHTML} from "../../lib/core/_html/_compile";
import {Formats} from "../../lib/core/_format";
import {Search} from "../../lib/core/support/Search";
import {__remap} from "../../lib/core/_util/_remap";
import {__className, __createHTML} from "../../lib/core/_dom/_commons";
import numbers = FormEvent.numbers;
import toDate = Formats.__toDate;
import {Forms} from "../../lib/core/_forms";
import __$attrEvent = Events.__$attrEvent;

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

    $$converter = (v) => v,

    ctrlContainer = __findByClass('data-ctrl', 0),
    tabsContainer = __findByClass('container-tabs', 0),
    container = __findById('data-table'),

    // template functions
    headerTemple = __compileHTML(__findById('table-header-template').innerText),
    bodyTemple = __compileHTML(__findById('table-body-template').innerText),
    formTemple = __compileHTML(__findById('form-template').innerText),

    $confirm = new ConfirmBox(document.getElementById('confirm-box')),

    // searchList
    searchList = __compileHTML('<li class="{{_.check ? \'active\' : \'\'}}" ::>' +
        '<span data-key="{{_.key}}" data-dismiss="{{_.title}}">{{_.title}}</span></li>'),

    // type:list
    createList = (function ($com) {
        let ul = <HTMLUListElement>__createHTML('<ul class="dropdown-box dropdown-list"></ul>', true);
        return (list: string[], current) => {
            ul.innerHTML = $com(list, current);
            return ul;
        }
    })(__compileHTML('<li class="{{_ === $.value ? \'active\' : \'\'}}" data-dismiss="{{_}}" ::>{{_}}</li>')),

    // type:date
    calendar = new SelectCalendar().$element((e, c) => {
        e.classList.add('dropdown-box');
    }),

    // input pre processor
    inputTypes = __remap({

        number: numbers,
        numeric: 'number',
        list(input: HTMLInputElement, item: iDataTable, form: Forms) {
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
        date(input: HTMLInputElement, item: iDataTable, form: Forms) {

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

class DataTable {

    private _searchList: SearchItem[]

    table: HTMLElement
    tbody: HTMLElement
    orders: HTMLElement[]
    form: Forms
    query: DataSearch
    names: string[] = []
    searchKey: string

    $toJSON = {}
    $toVALUE = {}
    $converter = {}

    constructor(public item: iDataTable) {


        let {headers, table} = item,
            query = this.query = <DataSearch>new Search().extend(item.query),

            tableElement = this.table = __createHTML(headerTemple(item), true),
            thead = __findByTag(tableElement, 'thead', 0),

            searchList = this._searchList = [];

        this.orders = __findAll(tableElement, '[data-order-value]');
        this.tbody = __findByTag(tableElement, 'tbody', 0);

        // headers 서치
        this.names = headers.reduce((r, v, i) => {
            let {name} = v;

            r[i] = name;

            this.$converter[name] = v.converter || $$converter;
            this.$toJSON[name] = v.toJSON
            this.$toVALUE[name] = v.toValue;

            /*
             *  text타입은 모두 search 대상이 된다.
             */
            if (v.type === 'text' || v.type === 'numeric') {
                if (searchList.push({key: name, title: v.title}) === 1)
                    this.searchKey = name;
            }

            return r;
        }, [])

        // order 순서변경
        thead.addEventListener('click', (e) => {
            let target = <HTMLElement>e.target,
                key = target.getAttribute('data-order-value');
            if (key) {
                query.order = __orders(key, target.getAttribute('data-order') === 'desc');
                query.page = 1;
                location.hash = table + '?' + query.toString();
            }
        });

        this.form = new ModifyForm(__createHTML(formTemple(headers)))
            .$element((element, forms) => {
                __findByAttr(element, 'data-type',
                    (r, e: HTMLInputElement, v) =>
                        inputTypes[v] && !e.readOnly && inputTypes[v](e, item, forms));
            });
    }

    setOrder(v: string) {
        let {orders, names} = this,
            [type, prop] = __orders(v);

        names.forEach((v, i) => {
            orders[i].setAttribute('data-order', v === prop ? type : '');
        });
    }

    run(val?) {
        location.hash = this.item.table + '?' + this.query.extend(val).toString()
        return this;
    }


    searchList(key: string, list: H, btn: H) {
        let {_searchList, searchKey, item: {headers}, names} = this;

        if (!key) key = searchKey;

        this.searchKey = key;
        btn.textContent = headers[names.indexOf(key)].title;
        list.innerHTML = searchList(_searchList.map(v => {
            v['check'] = key === v.key
            return v;
        }));
    }

    onLoad(values: ServerData<any>) {
        this.setOrder(this.query.order);
    }

    toConverter(v) {
        let {$converter} = this;
        return this.names.map( name => $converter[name](v[name], v) );
    }

    toValue(v) {
        return $extend(v, v, this.$toVALUE);
    }

    toJSON(v) {
        return $extend({}, v, this.$toJSON);
    }
}

class DataManager {

    private values: { [index: string]: iDataTable } = {}

    private items: { [index: string]: DataTable } = {}
    private names: string[] = []
    private _onLoad: OnLoadHandler[] = [];

    key: string
    contents: any[]
    dataTable: DataTable


    constructor(items: iDataTable[]) {
        let

            values = this.values,
            names = this.names,
            $$onLoad = this._onLoad, i = 0,
            pager = new Pager(__findByClass('data-ctrl-pager', 0), 5, 5),
                //.setHandler((page) => this.dataTable.run({page: page})),
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
                names.forEach((v, i) => __className(tabs[i], 'active', key === v));
            }
        })(__findAll(tabsContainer, '[data-table]'))

        // dataEvent
        __$attrEvent(__findByClass('container-table', 0), 'click', 'data-form', <any>this);

        // hashchange
        window.addEventListener('hashchange', () => this.run(location.hash));

        __selectA(ctrlContainer,
            ['.data-ctrl-search[0]', '{0}.data-ctrl-search-before[0]',
                '{1}<span>[0]', '{1}.dropdown-list[0]', '{0}<input>[0]'],
            (container: H, dropdown: H, btn: H, list: H, input: HTMLInputElement) => {

                let render = (key) => this.dataTable.searchList(key, list, btn);

                list.addEventListener('click', (e) => {
                    let key = e.target['getAttribute']('data-key');
                    if (key) render(key);
                });

                input.addEventListener('keyup', (e) => {
                    if (e.keyCode === 13) {
                        if (input.value) {
                            let contains = {};
                            contains[this.dataTable.searchKey] = input.value;
                            this.dataTable.run({contains: contains, page: 1});
                        }
                        else {
                            this.dataTable.run({contains: null, page: 1});
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
        if (!obj) obj = this.items[tableName] = new DataTable(this.values[tableName]);
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
            this.dataTable = obj;
            this.key = key;
        }

        Search.toObject(hash.slice(i + 1), this.dataTable.query);

        return this.$load();
    }

    private $load(query = this.dataTable.query) {

        let {key, dataTable, dataTable: {table, tbody, item, item: {headers}}} = this;

        $ajax.list(key, query).then(values => {
            let $contents = this.contents = values.contents.map(v => dataTable.toValue(v)),
                no = {headers: headers, total: values.totalElements - ((values.page - 1) * values.size)}

            container.textContent = '';
            tbody.innerHTML = bodyTemple($contents.map(v => dataTable.toConverter(v)), no);
            container.appendChild(table);

            // onload 핸들러
            this._onLoad.forEach(handler => handler(values, query, key));
            dataTable.onLoad(values);
        })

        return this;
    }


    // dataEvent Method
    create() {
        let {form, form: {element}, tbody} = this.dataTable;
        element.setAttribute('data-value', 'index:-1');
        element.classList.remove('modify-form');
        form.reset().valid();
        tbody.insertBefore(element, tbody.firstChild);
    }

    confirm({index}: any) {
        let {dataTable, dataTable: {form}} = this,
            values = form.values();
        if (index !== -1) {
            $ajax.save(this.key, dataTable.toJSON(values)).then(() => this.$load());
        } else {
            delete values['id'];
            $ajax.save(this.key, dataTable.toJSON(values)).then(() => this.$load());
        }
    }

    remove({index, event}: any) {
        let tr = event.target.parentElement.parentElement;
        if ($confirm.eventTarget !== tr) {
            event.stopPropagation()
            $confirm.on(event.pageX, event.pageY, tr, (flag) => {
                if (flag)
                    $ajax.remove(this.key, this.contents[index]['id'])
                        .then(() => this.$load())
            })
        }

    }

    modify({target, index}: any) {
        let {form, form: {element}} = this.dataTable;
        element.setAttribute('data-value', 'index:' + index);
        element.classList.add('modify-form');
        form.reset(this.contents[index]).valid()
        form.prepend(target);
    }
}


let $manager = new DataManager([new Receivable(), new BankAccount()])
    .run(location.hash ? location.hash : 'receivable');
