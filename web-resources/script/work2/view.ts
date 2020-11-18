import "../../lib/core/_event/_dropdown";
import {Arrays} from "../../lib/core/_array";
import {Templates} from "../../lib/core/_dom/_template";
import {$get} from "../../lib/core/_ajax";
import {Events} from "../../lib/core/_events";
import {__reduceFragment, __removeChild} from "../../lib/core/_dom/_commons";
import {Forms} from "../../lib/core/_forms";
import {Formats} from "../../lib/core/_format";
import {WorkUploader} from "./_support/uploader";
import {__extend} from "../../lib/core/_core";
import {VIEW_DATA, WORK, WORK_FILE, WORK_MEMO} from "./_types";
import {__input} from "./_support/_util";
import {__attrMap} from "../../lib/core/_dom/_select";
import __reduceN = Arrays.__reduceN;
import Template = Templates.Template;
import __$dataEvent = Events.__$dataEvent;
import $GET = Templates.$GET;
import __forEach = Arrays.__forEach;
import __number = Formats.__number;
import $FILTER = Templates.$FILTER;
import __move = Arrays.__move;
import {__findById} from "../../lib/core/_dom/_selector";

type E = HTMLElement;


// bootstrap
let state = '작업대기 시안검토 시안완료 제작중 입고 납품 완료'.split(' '),
    $spinner = (function (spinner) {
        return (d?) => d ? spinner.classList.add('on') : spinner.classList.remove('on');
    })(__findById('spinner'));

$FILTER({
    state(val) {
        return state[val];
    }
})

// Work
@Template('&work', false)
class Work {

    static $create: (data?) => Work

    $items: Item[] = [];
    $memos: WorkMemo[] = [];

    constructor(public element: E,
                public itemContainer: E,
                public memoContainer: E,
                public work: WORK, items) {

        this.addItem(items).addMemo(work.memo);


        // sort event
        let r = /tr/i, targetElement, moveElement, y: number;
        itemContainer.addEventListener('dragstart', (e) => {
            r.test(e.target['tagName']) && (targetElement = e.target as any).classList.add('drag-on');
            document.body.click();      // 혹시 열려있을지 모르는 드랍다운을 끄기 위함
        });
        itemContainer.addEventListener('dragend', (e) => {
            if (moveElement) {
                $spinner(1);
                let temp;
                this.sort($GET(temp = targetElement), $GET(moveElement)).then(() => {
                    temp.classList.remove('drag-on');
                    $spinner();
                });
            }
            else targetElement.classList.remove('drag-on');
            targetElement = moveElement = null;
        });
        itemContainer.addEventListener('dragover', (e) => {
            if (!targetElement) return;
            let target = e.target as E;
            do {
                if (r.test(target.tagName)) {
                    if (targetElement !== target) {
                        let h = target.offsetHeight / 2, {offsetY} = e;
                        if (y > (y = e.pageY)) {
                            if (h < offsetY) itemContainer.insertBefore(targetElement, moveElement = target);
                        } else if (h > offsetY) itemContainer.insertBefore(moveElement = target, targetElement);
                    }
                    return;
                }
            } while (target = target.parentElement);
        });

    }

    addMemo(data: WORK_MEMO | WORK_MEMO[]) {
        let values = (Array.isArray(data) ? data : [data]).map(v => WorkMemo.$create({memo: v}).apply());
        this.$memos = this.$memos.concat(values)
        return this.refresh(this.memoContainer, this.$memos);
    }

    removeMemo(data: WorkMemo) {
        let {$memos} = this;
        $memos.splice($memos.indexOf(data), 1);
        return this.refresh(this.memoContainer, this.$memos);
    }

    addItem(data: {} | {}[]) {
        let values = (Array.isArray(data) ? data : [data]).map(v => Item.$create({data: v, work: this}).apply());
        this.$items = this.$items.concat(values)
        return this.refresh(this.itemContainer, this.$items);
    }

    removeItem(item: Item) {
        let {$items} = this;
        $items.splice($items.indexOf(item), 1);
        return this.refresh(this.itemContainer, this.$items);
    }

    sort($from: Item, $to: Item) {
        return new Promise((y, n) => {
            let {$items} = this,
                from = $items.indexOf($from), to = $items.indexOf($to),
                items = this.$items = __move(this.$items, from, to);

            // 반대방향일 경우
            if (from > to) to = [from, from = to][0];
            items.slice(from, to + 1).forEach((item, i) => item.apply({priority: i + from}));

            setTimeout(() => y(), 1000);
        })
    }

    private refresh(container: E, values: any[]) {
        container.textContent = '';
        container.appendChild(__reduceN(values,
            (r, v) => r.appendChild(v.element), document.createDocumentFragment()
        ));
        return this;
    }

    apply() {
        let {work} = this;
        document.title = work.title + ' - ' + work.customer.name;
        return this;
    }

}

// Customer
@Template('&customer', false)
class Customer {
    static $create: (data?) => Customer

    constructor(public element: E, public data) {
    }

    apply() {
        return this;
    }
}


// Customer Form
@Template('&customerForm', false)
class CustomerForm {
    static $create: (data?) => CustomerForm

    constructor(public element: E, public customer) {
        element.addEventListener('click', (e) => e.target === element && this.off())
    }

    on() {
        this.element.classList.add('on');
        return this;
    }

    off() {
        this.element.classList.remove('on');
        return this;
    }

    apply() {
        return this;
    }
}


// Item
@Template('&item')
class Item {
    static $create: (data?) => Item

    static $newData(data) {
        return __extend({draft: [], print: [], datetime: new Date().getTime()}, data);
    }

    constructor(public element: E, public prints: E,
                public work: Work, public data) {
        this.addPrint(data.print);
    }

    addPrint(workFile: WORK_FILE | WORK_FILE[]) {
        let {prints} = this;
        workFile = Array.isArray(workFile) ? workFile : [workFile];
        prints.textContent = '';
        prints.appendChild(__reduceFragment(workFile, (v) => Print.$create({data: v}).apply().element));
        return this;
    }

    remove() {
        this.work.removeItem(this);
        return this;
    }

    apply(data?) {
        if (data) __extend(this.data, data);
        return this;
    }
}

// Item Form
@Template('&itemForm')
class ItemForm extends Forms {
    static $create: (data?) => ItemForm

    isNew: boolean
    item: Item

    constructor(public element: E, public work: Work) {
        super(element);

        let r = /[^\d]+/g,
            names = 'count price vat total'.split(' '),
            inputs = names.map(p => this.inputs[p][0] as HTMLInputElement),
            $num = (i) => inputs[i].value.replace(r, ''),
            processor = [
                (n: number[], pos: number) => parseInt($num(0) || '0'),
                (n: number[], pos: number) => parseInt($num(1) || '0'),
                ([c, p]: number[], pos: number) => {
                    if (pos < 2)
                        inputs[2].value = __number(Math.ceil((c * p) / 10));
                    return parseInt($num(2) || '0')

                },
                ([c, p, v]: number[], pos: number) => {
                    if (pos !== 3) {
                        inputs[3].value = __number(c * p + v);
                    }
                }
            ];
        // keyup 이벤트
        __forEach(inputs, (input, idx) => {
            input.addEventListener('keyup', () => {
                let v = $num(idx);
                input.value = v && __number(parseInt(v));
                let values = [];
                __forEach(processor, (func, i) => values[i] = func(values, idx))
            })
        });

        this.setHandlers(names, {set: ([input], v) => input.value = __number(v)});
    }

    put(item?: Item) {
        let {element} = this;
        if (this.item = item) {
            this.isNew = false;
            this.reset(item.data);
            element.classList.add('next-hide');
            item.element.parentElement.insertBefore(element, item.element);
        } else {
            this.isNew = true;
            this.reset();
            element.classList.remove('next-hide')
            this.work.itemContainer.appendChild(element);
            window.scrollTo(0, element.getBoundingClientRect().top)
        }
        this.element.getElementsByTagName('input')[0].focus();
        return this;
    }

    save() {
        let {work, item} = this;
        if (this.isNew) work.addItem(Item.$newData(this.values()));
        else item.apply(this.values());
        this.detach();
    }

    apply() {
        return this;
    }
}

// Screen
@Template('&screen', false)
class Screen {
    static $create: (data?) => Screen

    constructor(public element: E) {
        element.addEventListener('click', (e) => e.target === element && this.off());
    }

    on() {
        this.element.classList.add('on');
        return this;
    }

    off() {
        this.element.classList.remove('on');
        return this;
    }

    apply() {
        return this;
    }
}

// WorkMemo
@Template('&workMemo')
class WorkMemo {
    static $create: (d?) => WorkMemo

    constructor(public element: E, public data: WORK_MEMO) {
    }

    apply() {
        return this;
    }
}

// Memo Form
@Template('&memoForm')
class MemoForm {
    static $create: () => MemoForm

    constructor(public element: E) {

    }

    apply() {
        return this;
    }
}


// Ref
@Template('&workRef')
class WorkRef {
    static $create: (d?) => WorkRef

    constructor(public element: E, public data) {
    }

    apply() {
        return this;
    }
}

// Print
@Template('&print')
class Print {

    static $create: (d?) => Print

    constructor(public element: E, public data: WORK_FILE) {
    }

    apply() {
        return this;
    }
}


// Confirm Box
@Template('&confirmBox', false)
class ConfirmBox {
    static $create: (d?) => ConfirmBox

    target: any

    constructor(public element: E, public confirm: E, public cancel: E) {
        confirm.addEventListener('click', () => {
            this.target && this.target.remove();
        });

        element.addEventListener('dropdown.close', (e) => this.__close0());
    }

    private __close0() {
        if (this.target) {
            this.target.element && this.target.element.classList.remove('delete');
            this.target = null;
        }
        return this;
    }

    on(e: MouseEvent, ele: E, target) {
        this.__close0().target = target;

        let {pageX, pageY} = e;
        let {element, element: {style}} = this;
        style.top = (pageY + 5) + 'px';
        style.left = 'auto';
        style.right = (window.innerWidth - pageX - ele.offsetWidth) + 'px';
        element.classList.add('dropdown-open');

        target.element && target.element.classList.add('delete');

        e['dropdown_skip'] = element;   // for dropdown event!!

        return this;
    }

    apply() {
        return this;
    }
}

@Template('&bill', false)
class Bill {
    static $create: (data?) => Bill

    work
    items
    customer
    type

    templates: HTMLElement[]

    company = {
        biz_num: '124-53-35359', name: '한컴기획', owner: '고정철', address: '수원시 권선구 산업로156번길 142-10 수원벤처밸리2 A동 B122호',
        biz_con: '서비스/제조업', biz_type: '옥외광고/인쇄/기획'
    }

    constructor(public element: E, public container: E) {
        element.addEventListener('click', (e) => e.target === element && this.off());
        this.templates = __attrMap(element, 'data-type', 'estimate account receipt'.split(' '));
        this.templates.forEach(v => v.parentElement.removeChild(v));
    }

    on(type: number, data) {

        this.container.textContent = '';

        this.type = type;
        this.work = data.work;
        this.items = data.items;
        this.customer = data.customer;

        this.container.appendChild(this.templates[this.type]);
        this.apply().element.classList.add('on');
        return this;
    }

    off() {
        this.element.classList.remove('on');
        return this;
    }

    apply() {
        return this;
    }
}

(function (pathname) {

    pathname = pathname.slice(pathname.lastIndexOf('/') + 1);

    $get('/work/view?uuid=' + pathname).then((data: VIEW_DATA) => {

        console.log(data);

        let
            uploader = WorkUploader.$create(),
            confirmBox = ConfirmBox.$create(),
            screen = Screen.$create(),
            customer = Customer.$create({data: data.work.customer}).apply(),
            customerForm = CustomerForm.$create({data: customer}),
            work = Work.$create({work: data.work, items: data.items}).apply(),
            itemForm = ItemForm.$create({work: work}),

            p_estimate = Bill.$create();

        __$dataEvent(document.getElementsByClassName('row')[0], 'click', 'data-event',
            class Evt {

                static input

                element: E
                state: number
                item: Item
                itemForm: ItemForm
                printType: number

                constructor(public event: MouseEvent, public eventTarget: E) {
                }

                get(e, p) {
                    this[p] = $GET(e);
                }

            },
            {
                // Work Event
                removeWork() {

                },
                state({state}) {
                    if (state != null) {
                        work.work.state = state;
                        work.apply();
                    }
                },
                uploadRef(evt) {
                    __input((files) => {
                        __forEach(files, (file) => {
                            uploader.add(file, null, () => {
                            });
                        })
                    });
                },
                removeRef() {

                },
                addMemo() {

                },
                removeMemo() {

                },

                // Item Event
                removeItem({item, eventTarget, event}) {
                    confirmBox.on(event, eventTarget, item);
                },
                modifyItem({item}) {
                    itemForm.put(item).apply();
                },
                updateItem({itemForm}) {
                    itemForm.save();
                },
                cancelItem({itemForm}) {
                    itemForm.detach();
                },
                draft() {
                    screen.on();
                },
                removeDraft() {

                },
                uploadPrint() {

                },
                removePrint() {

                },

                // Customer Event
                modifyCustomer({}) {
                    customerForm.on();
                },

                // printManager
                bill({printType, event}) {
                    if (typeof printType === 'number')
                        p_estimate.on(printType, {
                            customer: customer.data,
                            work: work.work,
                            items: work.$items.map(v => v.data)
                        });
                },
            });

        window.scrollTo(0, 0);
    });
})(location.pathname);