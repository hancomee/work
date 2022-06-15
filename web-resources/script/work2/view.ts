import "../../lib/core/_event/_toggle";
import {Arrays} from "../../lib/core/_array";
import {$get} from "../../lib/core/_ajax";
import {Events} from "../../lib/core/_events";
import {Forms} from "../../lib/core/_forms";
import {Formats} from "../../lib/core/_format";
import {WorkUploader} from "./_support/uploader";
import {__extend} from "../../lib/core/_core";
import {VIEW_DATA, WORK, WORK_FILE, WORK_ITEM, WORK_MEMO} from "./_types";
import {$delete, $post, __appendFragment, __input} from "./_support/_util";
import {__attrMap} from "../../lib/core/_dom/_select";
import {__findById} from "../../lib/core/_dom/_selector";
import {Template} from "../../lib/core/_dom/_template";
import {__resizing} from "../../lib/core/_media/_resize";
import {__m3} from "./_support/_component";
import {__pasteImage} from "../../lib/core/support/patseImage";
import __reduceN = Arrays.__reduceN;
import __forEach = Arrays.__forEach;
import __number = Formats.__number;
import __move = Arrays.__move;
import __$attrEvent = Events.__$attrEvent;

type E = HTMLElement;
type A = HTMLAnchorElement;
type T = HTMLTextAreaElement;
type I = HTMLInputElement;


// bootstrap
const

    {forEach, map} = Array.prototype,
    state = '작업대기 시안검토 시안완료 작업중 입고 납품 완료'.split(' '),
    $block = (function (element) {

        const
            viewer = element.getElementsByClassName('viewer')[0] as E,
            __handler = (d?) => {
                if (d) {
                    element.classList.add('on');
                    if (d.nodeType === 1) {
                        viewer.appendChild(d);
                        element.classList.add('viewer');
                    }
                } else {
                    element.classList.remove('on');
                    element.classList.remove('viewer');
                    viewer.textContent = '';
                }
            };

        __resizing(viewer);

        element.addEventListener('mousedown', ({target}) => {
            element.classList.contains('viewer') && !target['hasAttribute']('src') && __handler();
        });

        return __handler
    })(__findById('block')),

    $GET = Template.get,

    __filedata = (file: File) => {
        let {size, type, name} = file,
            [, pre, sufix] = /(.*)\.(.*)/.exec(name);

        return {
            id: undefined,
            content_type: type.replace('jpeg', 'jpg'),
            datetime: new Date().getTime(),
            filetype: sufix,
            original_name: pre,
            save_name: undefined,
            size: size
        };
    },
    __vat = (count, price): number => Math.ceil((count * price) / 10);


Template.addFilter({
    state(val) {
        return state[val];
    }
})

// Work
@Template('&work', false)
class Work {

    static $create: (data?) => Work
    static path: string

    $items: Item[] = [];
    $memos: WorkMemo[] = [];
    $refs: WorkRef[] = [];

    constructor(public element: E,
                public itemContainer: E,
                public memoContainer: E,
                public refContainer: E,
                public work: WORK, items) {

        this.addItem(items)
            .addMemo(work.memo)
            .addRef(work.refs)

        /* *************************  ▼ 품목 정렬 ▼  ************************* */
        let
            targetElement: E,
            result: number = 0,
            y: number,
            handler = {
                // 드래그 객체 자동복제생성하는 브라우저 기본동작 막기
                dragstart: (e: DragEvent) => e.preventDefault(),
                mouseup: () => {
                    for (let p in handler) document.removeEventListener(p, handler[p]);
                    targetElement.style.transform = '';
                    targetElement.classList.remove('drag-on');
                    if (result) {
                        $block(1);
                        let ids = this.sort($GET(targetElement), result * -1);
                        $post('/work/db/item/priority', ids).then(res => $block());
                    }
                },
                mousemove: (e: MouseEvent) => {
                    let moveY = e.pageY - y,    // 음수 : 위로, 양수 : 아래로
                        isUp = moveY < 0,
                        abs = Math.abs(moveY),
                        next = (isUp ? targetElement.previousElementSibling : targetElement.nextElementSibling) as E;

                    if (next) {
                        let
                            height = next.offsetHeight;

                        if (abs > height / 2 + 5) {
                            if (isUp) {
                                itemContainer.insertBefore(targetElement, next);
                                y = e.pageY + (abs - height);
                                moveY += height;    // 칸이 올라갔으므로 높이값만큼 위치값을 더해준다.
                                result++;
                            } else {
                                itemContainer.insertBefore(next, targetElement);
                                y = e.pageY + (height - abs);
                                moveY -= height;
                                result--;
                            }
                        }
                        targetElement.style.transform = 'translate(0, ' + moveY + 'px)';
                    }
                }
            };

        // init
        itemContainer.addEventListener('mousedown', (e) => {
            let target = e.target as E;

            if (target.hasAttribute('data-sort')) {
                targetElement = target.closest('.item') as E;
                targetElement.classList.add('drag-on');

                result = 0;
                y = e.pageY;

                document.body.click();      // 혹시 열려있을지 모르는 드랍다운을 끄기 위함
                for (let p in handler) document.addEventListener(p, handler[p]);
            }
        });
        /* *************************  ▲ 품목 정렬 ▲  ************************* */
    }

    addRef(data: WORK_FILE | WORK_FILE[]) {
        let values = (Array.isArray(data) ? data : [data]).map(v => WorkRef.$create({data: v}).apply());
        this.$refs = this.$refs.concat(values)
        return this.refresh(this.refContainer, this.$refs);
    }

    removeRef(data: WorkRef) {
        let {$refs} = this;
        $refs.splice($refs.indexOf(data), 1);
        return this.refresh(this.refContainer, $refs);
    }

    addMemo(data: WORK_MEMO | WORK_MEMO[]) {
        let values = (Array.isArray(data) ? data : [data]).map(v => WorkMemo.$create({data: v}).apply());
        this.$memos = this.$memos.concat(values)
        return this.refresh(this.memoContainer, this.$memos);
    }

    removeMemo(data: WorkMemo) {
        let {$memos} = this;
        $memos.splice($memos.indexOf(data), 1);
        return this.refresh(this.memoContainer, $memos);
    }

    addItem(data: {} | {}[]) {
        let values = (Array.isArray(data) ? data : [data]).map(v => Item.$create({data: v, work: this}).apply());
        this.$items = this.$items.concat(values)
        return this.refresh(this.itemContainer, this.$items);
    }

    removeItem(item: Item) {
        let {$items} = this;
        $items.splice($items.indexOf(item), 1);
        return this.refresh(this.itemContainer, $items);
    }

    sort(item: Item, move: number) {
        let {$items} = this, i = $items.indexOf(item), result = [];
        $items = this.$items = __move($items, i, i + move);
        $items.forEach((item, i) => {
            result[i] = item.data.id;
            item.apply({priority: i});
        });
        return result;
    }

    private refresh(container: E, values: any[]) {
        container.textContent = '';
        container.appendChild(__reduceN(values,
            (r, v) => r.appendChild(v.element), document.createDocumentFragment()
        ));
        return this;
    }

    // 총액 계산
    compute() {
        let {$items, work} = this,
            price = 0, vat = 0, total = 0;
        $items.forEach(({data}) => {
            vat += data.vat;
            total += data.total;
        });
        work.total = total + vat;
        work.price = total;
        work.vat = vat;
        return this;
    }

    /*
     *  금액을 갱신한다.
     */
    apply(data?) {
        let {work} = this.compute();
        if (data) for (let p in data) work[p] = data[p];
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


    apply(values?) {
        if (values) {
            let {data} = this;
            for (let p in values) data[p] = values[p];
        }
        return this;
    }
}


// Customer Form
@Template('&customerForm', false)
class CustomerForm extends Forms {
    static $create: (data?) => CustomerForm

    constructor(public element: E, public customer) {
        super(element);
    }

    on(data) {
        this.reset(data);
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

    prints: WorkPrint[] = []
    drafts: WORK_FILE[]

    constructor(public element: E,
                public printContainer: E,
                public work: Work,
                public data: WORK_ITEM) {

        this.drafts = data.draft;

        this.addPrint(data.print);
    }

    addPrint(workFile: WORK_FILE | WORK_FILE[]) {
        workFile = Array.isArray(workFile) ? workFile : [workFile]
        this.prints = this.prints.concat(workFile.map(data => WorkPrint.$create({data: data, item: this}).apply()));
        return this.refresh(this.printContainer, this.prints).apply();
    }

    removePrint(workFile: WorkPrint) {
        let {prints} = this;
        prints.splice(prints.indexOf(workFile), 1);
        return this.refresh(this.printContainer, this.prints).apply();
    }

    addDraft(workFile: WORK_FILE) {
        this.drafts.push(workFile);
        return this.apply();
    }

    removeDraft(workFile: WORK_FILE) {
        let {drafts} = this;
        drafts.splice(drafts.indexOf(workFile), 1);
        return this.apply();
    }


    private refresh(container: E, values: any[]) {
        container.textContent = '';
        container.appendChild(__reduceN(values,
            (r, v) => r.appendChild(v.element), document.createDocumentFragment()
        ));
        return this;
    }

    remove() {
        this.element.onanimationend = () => this.work.removeItem(this);
        this.element.classList.add('delete-ani');
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

    item: Item

    constructor(public element: E, public work: Work) {
        super(element);


        // 숫자폼의 빈칸도 0으로 사용하기 위해.
        this.ignoreEmpty(false);
        /*
         *  금액 자동계산 로직
         */
        let r = /[^\d]/g,
            inputs = 'count price total vat'.split(' ').map(p => this.inputs[p][0] as I);

        element.addEventListener('keyup', (e) => {

            if (e.ctrlKey || 'Tab Enter Backspace Control'.indexOf(e.key) !== -1) return;

            // count / price / total / vat
            let values = inputs.map((input, i) => {
                input.value = input.value.replace(r, '');
                return input.value ? parseInt(input.value) : 0;
            });

            if (e.target === inputs[1] || e.target === inputs[0]) {
                if (values[1] > 0 && values[0] > 0) {
                    values[2] = values[0] * values[1];
                    values[3] = values[2] / 10;
                }
            } else if (e.target === inputs[2]) values[3] = values[2] / 10;

            values.forEach((val, i) => inputs[i].value = values[i] ? __number(values[i]) : '');

        });

    }

    on(item?: Item) {
        let {element} = this;
        if (this.item = item) {
            this.reset(item.data);
            element.classList.add('next-hide');
            item.element.parentElement.insertBefore(element, item.element);
        } else {
            this.reset();
            element.classList.remove('next-hide')
            this.work.itemContainer.appendChild(element);
        }
        this.element.getElementsByTagName('input')[0].focus();
        return this;
    }

    isActive() {
        return !!this.element.parentElement;
    }


    save() {
        let {item, work} = this,
            values = this.values();
        values.id = item ? item.data.id : undefined;
        values.priority = item ? item.data.priority : work.$items.length;

        $block(1);
        return $post('/work/db/item/' + work.work.id, values).then(res => res.json()).then(id => {
            values.id = id;
            item ? item.apply(values) : work.addItem(Item.$newData(values));
            work.apply();
            this.detach();
            $block();
        })
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

    apply(data?) {
        if (data) {
            this.data.value = data.value;
        }
        return this;
    }
}

// Memo Form
@Template('&memoForm')
class MemoForm {
    static $create: (a) => MemoForm

    memo: WorkMemo

    constructor(public element: E, public container: E, public textarea: T) {

    }

    add() {
        let {element, container} = this;
        container.insertBefore(element, container.firstChild);
        return this;
    }

    modify(memo: WorkMemo) {
        let {element, element: {classList}, textarea} = this, target = memo.element;
        classList.add('next-hide');
        target.parentElement.insertBefore(element, target);
        textarea.value = memo.data.value;
        this.memo = memo;
        return this;
    }

    clear() {
        let {element, textarea} = this;
        element.classList.remove('next-hide');
        element.parentElement && element.parentElement.removeChild(element);
        textarea.value = '';
        this.memo = null;
        return this;
    }

    apply() {
        return this;
    }
}


// Print
@Template('&workPrint')
class WorkPrint {
    static $create: (d?) => WorkPrint

    constructor(public element: E, public data: WORK_FILE, public icon: A, public item: Item) {
        icon.classList.add('file-icon-' + data.filetype);
        let {filetype, original_name, save_name} = data,
            href = Work.path + save_name + '.' + filetype;
        icon.setAttribute('href', href + '?attachment=' + original_name + '.' + filetype)
    }

    apply() {
        return this;
    }
}


// Ref
@Template('&workRef')
class WorkRef {
    static $create: (d?) => WorkRef

    constructor(public element: E, public data: WORK_FILE, public icon: A) {

        let {filetype, original_name, save_name} = data,
            href = Work.path + save_name + '.' + filetype;

        // 이미지일 경우 미리보기로
        if (data.content_type.indexOf('image') === 0) {
            icon.parentElement.setAttribute('data-event', 'imgView');
            icon.parentElement.innerHTML = '<img src="' + href + '">'
        } else {
            icon.classList.add('file-icon-' + data.filetype);
            icon.setAttribute('href', href + '?attachment=' + original_name + '.' + filetype);
        }


    }

    apply() {
        return this;
    }
}


@Template('&imgTemplate')
class ImgTemplate {
    static $create: (data?) => ImgTemplate

    url: string

    constructor(public element: E, public img: HTMLImageElement, public data: WORK_FILE, public item: Item) {
        this.url = Work.path + data.save_name + '.' + data.filetype;
    }

    apply() {
        return this;
    }
}

// Screen
@Template('&screen', false)
class Screen {
    static $create: (data?) => Screen

    item: Item
    list: ImgTemplate[]

    img: HTMLImageElement

    constructor(public element: E,
                public imgContainer: E,
                public imgList: E,
                public uploader: WorkUploader,
                public save_path: string
    ) {
        __resizing(imgContainer);
        
        // ctrl + v 이미지 등록
        element.addEventListener('paste', (e) => {
            forEach.call(e.clipboardData.files, (v: File) => v.type.indexOf('image') === 0 && this.upload(v));
        });
    }

    on(item: Item) {
        this.list = [];
        this.item = item;
        this.imgList.textContent = this.imgContainer.textContent = '';
        this.addImage(item.drafts);

        // 첫번째 이미지 띄우기
        if (this.list.length) {
            this.view(this.list[0].img);
        }

        this.element.classList.add('on');
        return this;
    }

    off() {
        this.element.classList.remove('on');
        return this;
    }

    upload(file: File) {
        let {uploader, save_path, item} = this,
            data = __filedata(file);

        uploader.add(file, {path: save_path, type: data.filetype}, (xhr) => {
            data.save_name = xhr.responseText;
            $post('/work/db/draft/' + item.data.id, data).then(res => res.json()).then(id => {
                data.id = id;
                item.addDraft(data);
                this.addImage([data]);
            })
        });
    }

    view(img) {
        this.img = new Image();
        this.img.src = img.src;
        this.imgContainer.textContent = '';
        this.imgContainer.appendChild(this.img);
        return this;
    }

    removeImage(template: ImgTemplate) {
        let {list} = this, pos = list.indexOf(template);
        list.splice(pos, 1);

        // 삭제된 이미지가 view에 열려있다면 지운다
        if (this.img.src === template.img.src)
            this.imgContainer.textContent = '';

        return this.apply();
    }

    addImage(imgs: WORK_FILE[]) {
        this.list = this.list.concat(imgs.map(draft => ImgTemplate.$create({data: draft, item: this.item}).apply()));
        return this.apply();
    }

    apply() {
        this.imgList.textContent = '';
        this.imgList.appendChild(__appendFragment(this.list));
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
        biz_num: '124-53-35359', name: '한컴기획', owner: '고정철',
        address: '수원시 권선구 산업로156번길 142-10 수원벤처밸리2 A동 B122호',
        biz_con: '서비스/제조업', biz_type: '옥외광고/인쇄/기획'
    }

    constructor(public element: E, public container: E) {
        element.addEventListener('click', (e) => {
            e.target === container && this.off()
        });
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

        const

            {work: work_data, work: {id: work_id, customer_id, uuid}} = data,

            uuid_array = ((array) => {
                Work.path = '/workdata/' + array.join('/') + '/';
                return array;
            })(/(\d{4})\-(\d{2})(\d+)/.exec(uuid).slice(1)),

            save_path = uuid_array.join('/'),

            uploader = WorkUploader.$create(),
            screen = Screen.$create({uploader: uploader, save_path: save_path}),
            customer = Customer.$create({data: data.work.customer}).apply(),
            work = Work.$create({work: data.work, items: data.items, data: data}).apply(),

            memoForm = MemoForm.$create({container: work.memoContainer}),
            customerForm = CustomerForm.$create({data: customer}),
            itemForm = ItemForm.$create({work: work}),

            p_estimate = Bill.$create(),

            workText = document.getElementById('workText') as T,
            inputSubject = document.getElementById('subject') as I;


        __$attrEvent(document.body, 'click', 'data-event',
            class Evt {

                static input

                element: E
                state: number
                printType: number

                work: Work
                item: Item
                workMemo: WorkMemo

                workRef: WorkRef
                workPrint: WorkPrint
                imgTemplate: ImgTemplate

                view
                viewValue

                constructor(public e: MouseEvent, public eventTarget: E) {
                }

                _template(e) {
                    this[e.getAttribute('_template')] = $GET(e);
                }
            },
            {

                changeState({state}) {
                    if (state != null) {
                        $post('/work/db/update/state/' + work_id + '/' + state, null).then(res => {
                            work.work.state = state;
                            work.apply();
                        });
                    }
                },

                // 아이템, 메모 등 항목 닫기
                toggle({eventTarget}) {
                    let {classList} = eventTarget.parentElement;
                    if (classList.contains('close')) classList.remove('close');
                    else classList.add('close');
                },

                // Work Event
                removeWork() {
                    $block(1);
                    $delete('/work/db/remove/' + work.work.id).then(res => {
                        location.href = '/work/list#state=' + work.work.state;
                    });
                },

                // Customer Event
                modifyCustomer({}) {
                    customerForm.on(customer.data);
                },

                cancelCustomer() {
                    customerForm.off();
                },

                confirmCustomer() {
                    let values = customerForm.values();
                    values.id = customer_id;
                    $post('/work/db/customer', values).then(res => {
                        customer.apply(values);
                        customerForm.off();
                    });
                },

                /* ****************** ▼ 작업제목 ▼ ****************** */
                modifySubject({element, viewValue}) {
                    inputSubject.value = work.work.title;
                    element.setAttribute('data-view', viewValue);
                },

                cancelSubject({element, viewValue}) {
                    element.setAttribute('data-view', viewValue);
                },

                confirmSubject({element, viewValue}) {
                    $post('/work/db/update/' + work_id, {title: inputSubject.value}).then(res => {
                        work.work.title = inputSubject.value;
                        work.apply();
                        element.setAttribute('data-view', viewValue);
                    });
                },
                /* ****************** ▲ 작업제목 ▲ ****************** */


                /* ****************** ▼ 견적품목 ▼ ****************** */
                addItem() {
                    itemForm.on().apply();
                },
                modifyItem({item}) {
                    itemForm.on(item).apply();
                },
                saveItem() {
                    itemForm.save();
                },
                removeItem({item}) {
                    $block(1)
                    $delete('/work/db/item/' + item.data.id).then(res => {
                        work.removeItem(item).apply();
                        $block();
                    });
                },
                cancelItem() {
                    itemForm.detach();
                },
                /* ****************** ▲ 견적품목 ▲ ****************** */


                /* ****************** ▼ 견적메모 ▼ ****************** */
                modifyText({element, viewValue}) {
                    workText.removeAttribute('disabled');
                    element.setAttribute('data-view', viewValue);
                },
                confirmText({element, viewValue}) {
                    let value = {text: workText.value.trim()};
                    $post('/work/db/update/' + work_id, value).then(res => {
                        work.apply(value);
                        workText.setAttribute('disabled', 'true');
                        element.setAttribute('data-view', viewValue);
                    });
                },
                cancelText({element, viewValue}) {
                    workText.value = work_data.text;
                    workText.setAttribute('disabled', 'true');
                    element.setAttribute('data-view', viewValue);
                },
                /* ****************** ▲ 견적메모 ▲ ****************** */



                /* ****************** ▼ 메모 ▼ ****************** */
                addMemo() {
                    memoForm.clear().add();
                },
                removeMemo({workMemo}) {
                    $delete('/work/db/memo/' + workMemo.data.id + '/' + work_id).then(res => {
                        work.removeMemo(workMemo);
                    });
                },
                modifyMemo({workMemo}) {
                    memoForm.modify(workMemo);
                },
                cancelMemo() {
                    memoForm.clear();
                },
                confirmMemo() {
                    let {memo} = memoForm,
                        val = {
                            id: memo ? memo.data.id : undefined,
                            datetime: memo ? memo.data.datetime : new Date().getTime(),
                            value: memoForm.textarea.value
                        }
                    $post('/work/db/memo/' + work_id, val).then(res => res.json()).then(id => {
                        val.id = id;
                        memo ? memo.apply(val) : work.addMemo(val);
                        memoForm.clear();
                    })
                },
                /* ****************** ▲ 메모 ▲ ****************** */




                /* ****************** ▼ 시안 ▼ ****************** */
                draft({item}) {
                    screen.on(item).apply();
                },
                uploadDraft({}) {
                    let {item} = screen;
                    __input((files) => {
                        __forEach(files, (file) => screen.upload(file))
                    });
                },
                screenClose() {
                    screen.off();
                },
                viewDraft({imgTemplate}) {
                    screen.view(imgTemplate.img);
                },
                removeDraft({imgTemplate}) {
                    let {item, data} = imgTemplate;
                    $delete('/work/db/draft/' + data.id).then(res => {
                        item.removeDraft(data);
                        screen.removeImage(imgTemplate);
                    })
                },
                /* ****************** ▲ 시안 ▲ ****************** */


                /* ****************** ▼ 인쇄파일 ▼ ****************** */
                removePrint({workPrint}) {
                    $delete('/work/db/print/' + workPrint.data.id).then(res => {
                        workPrint.item.removePrint(workPrint);
                    });
                },
                uploadPrint({item}) {
                    __input((files) => {
                        let file = files[0],
                            data = __filedata(file);

                        uploader.add(file, {path: save_path, type: data.filetype}, (xhr) => {
                            data.save_name = xhr.responseText;
                            $post('/work/db/print/' + item.data.id, data).then(res => res.json()).then(id => {
                                data.id = id;
                                item.addPrint(data);
                            });
                        });
                    }, false);
                },
                /* ****************** ▲ 인쇄파일 ▲ ****************** */


                /* ****************** ▼ 참고파일 ▼ ****************** */
                uploadRef() {
                    __input((files) => {
                        __forEach(files, (file) => {
                            let data = __filedata(file);
                            uploader.add(file, {path: save_path, type: data.filetype}, (xhr) => {
                                data.save_name = xhr.responseText;
                                $post('/work/db/ref/' + work_id, data).then(res => res.json()).then(id => {
                                    data.id = id;
                                    work.addRef(data);
                                })
                            });
                        })
                    });
                },
                removeRef({workRef}) {
                    $delete('/work/db/ref/' + workRef.data.id).then(res => {
                        work.removeRef(workRef);
                    });
                },
                // 참고파일 중 이미지는 미리보기
                imgView({e}) {
                    $block(e.target['cloneNode']());
                },
                /* ****************** ▲ 참고파일 ▲ ****************** */


                // printManager
                bill({printType}) {
                    if (typeof printType === 'number')
                        p_estimate.on(printType, {
                            customer: customer.data,
                            work: work.work,
                            items: work.$items.map(v => v.data)
                        });
                },
            });

        // 헤배계산
        __m3(document.getElementById('m3'));

        // 단축키
        const $keyEvent = {
            Esc(target) {
                target === document.body && itemForm.detach();

            },
            '+'(target) {
                target === document.body && itemForm.on().apply();
            },
            Enter(target) {
                itemForm.element.contains(target) && itemForm.isActive() && itemForm.save();
            }
        };
        addEventListener('keyup', (e) => $keyEvent[e.key] && $keyEvent[e.key](e.target, e))


        window.scrollTo(0, 0);
    });


})(location.pathname);