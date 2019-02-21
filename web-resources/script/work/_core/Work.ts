import {$extend} from "../../../lib/core/core";
import {Formats} from "../../../lib/core/format";
import datetime = Formats.datetime;


function $get(url: string): Promise<any> {
    return new Promise((resolve, error) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
                else error(xhr);
            }
        }
        xhr.open('GET', url, true);
        xhr.send(null);
    });
}


function $post(url: string, data): Promise<any> {
    return new Promise((resolve, error) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200)
                    resolve(xhr.responseText && JSON.parse(xhr.responseText));
                else error(xhr);
            }
        }
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    });
}

function $delete(url: string): Promise<any> {
    return new Promise((resolve, error) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) resolve();
                else error(xhr);
            }
        }
        xhr.open('DELETE', url, true);
        xhr.send(null);
    });
}


let
    $disassemble = {
        activetime(v) {
            if (!v) return null;
            return v instanceof Date ? v : new Date(v)
        },
        datetime(v) {
            if (!v) return null;
            return v instanceof Date ? v : new Date(v)
        },
        updatetime(v) {
            if (!v) return null;
            return v instanceof Date ? v : new Date(v)
        },

        // list용
        customer(this: Work, v) {
            this.customer = new Customer(v);
        },

        refs(this: Work, v: any[]) {
            v.forEach(a => this.addRef(new WorkFile(a)));
        },
        print(this: WorkItem, v: any[]) {
            v.forEach(a => this.addPrint(new WorkFile(a)));
        },
        draft(this: WorkItem, v: any[]) {
            v.forEach(a => this.addDraft(new WorkFile(a)));
        },


        // work용
        // customer에도 같은 이름이 있으므로 이를 구분하는 분기가 있다.
        memo(this: Work, v: any[]) {

            if (Array.isArray(v))
                this.memo = v.map(a => new WorkMemo(a).setWork(this));
            else this.memo = v;
        },
        uuid(this: Work, v) {
            this.uuid = v;
        },
    },

    // 객체를 json data로 변경할때
    $assemble = (function () {
        let $$ = {
            activetime(v) {
                return datetime(v);
            },
            datetime(v) {
                return datetime(v)
            },
            updatetime(v) {
                return datetime(v)
            },
            // work객체는 work_id로 바꾼다.
            work(v: Work) {
                v && (this['work_id'] = v.id);
            },
            // draft, print는 json 변환에는 제외시킨다.
            print: false,
            draft: false,
            memo: false
        }

        return (data) => $extend({}, data, $$);
    })();


//********************** Class **********************//
export class Work {
    id: number
    uuid: string

    state: number
    title: string
    text: string

    datetime: Date
    updatetime: Date
    activetime: Date

    price = 0
    total = 0
    vat = 0

    file_len = 0
    item_len = 0
    memo_len = 0

    customer: Customer
    refs: WorkFile[] = []
    memo: WorkMemo[] = []
    items: WorkItem[] = []

    img: WorkFile

    constructor(data?) {
        data && $extend(this, data, $disassemble);
    }

    addRef(v: WorkFile) {
        this.refs.push(v);
        this.file_len = this.refs.length;
        return this;
    }

    removeRef(v: WorkFile) {
        let {refs} = this;
        refs.splice(refs.indexOf(v), 1);
        this.file_len = refs.length;
        return this;
    }

    addMemo(v: WorkMemo) {
        console.log(v);
        this.memo.push(v);
        this.memo_len = this.memo.length;
        return this;
    }

    removeMemo(v: WorkMemo) {
        let {memo} = this;
        memo.splice(memo.indexOf(v), 1);
        this.memo_len = memo.length;
    }

    compute() {
        let price = 0, vat = 0, total = 0;
        this.items.forEach(item => {
            price += item.price;
            vat += item.vat;
            total += item.total;
        });

        this.price = price;
        this.vat = vat;
        this.total = total;
        return this;
    }

    addItem(item: WorkItem) {
        this.item_len = this.items.push(item);
        return this.compute();
    }

    removeItem(item: WorkItem) {
        let {items} = this;
        items.splice(items.indexOf(item), 1);
        this.item_len = items.length;
        return this.compute();
    }
}


export class WorkMemo {
    id?: number
    datetime: Date
    value: string

    work: Work

    constructor(data?) {
        data && $extend(this, data, $disassemble);
    }

    setWork(work: Work) {
        this.work = work;
        return this;
    }
}


export class WorkItem {
    id: number

    // requried
    subject: string

    count = 0
    datetime: Date
    detail = ''
    memo = ''
    price = 0
    total = 0
    vat = 0
    priority = 0

    draft: WorkFile[] = []
    print: WorkFile[] = []


    /*
     *  draft와 print에 path를 넣어주기 위해서 어쩔 수 없이 work를 생성인자로..
     */
    constructor(public work: Work, data?) {
        data && $extend(this, data, $disassemble);
        work.addItem(this);
    }

    addDraft(v: WorkFile) {
        this.draft.push(v);
        return this;
    }

    removeDraft(v: WorkFile) {
        let {draft} = this;
        draft.splice(draft.indexOf(v), 1);
        return this;
    }

    addPrint(v: WorkFile) {
        // 인쇄파일은 나중에 등록한 파일이 맨 먼저 나오게 한다.
        this.print.unshift(v);
        return this;
    }

    removePrint(v: WorkFile) {
        let {print} = this;
        print.splice(print.indexOf(v), 1);
        return this;
    }
}


export class Customer {
    id: number
    address: string
    biz_con: string
    biz_num: string
    biz_type: string
    datetime: Date
    email: string
    fax: string
    memo: string
    mobile: string
    name: string
    owner: string
    tel: string

    constructor(data?) {
        data && $extend(this, data, $disassemble);
    }

    setId(id: number) {
        this.id = id;
        return this;
    }

}


export class WorkFile {
    id: number
    datetime: Date
    original_name: string
    save_name: string
    filetype: string
    size: number
    content_type: string

    constructor(data?) {
        data && $extend(this, data, $disassemble);
    }

    setId(id: number) {
        this.id = id;
        return this;
    }

    getOrigName() {
        return this.original_name + '.' + this.filetype;
    }

    getSaveName() {
        return this.save_name + '.' + this.filetype;
    }


}


// ***************************** namespace ***************************** //
export namespace Work {

    export let $state = '작업대기 시안검토 시안완료 제작중 입고 납품 완료'.split(' ');

    export interface ViewData {
        work: Work
        items: WorkItem[]
    }


    // 2018-0600442 ==> 2018/06/00442
    export function toPath(uuid: string) {
        let [y, m] = uuid.split(/-/);
        return y + '/' + m.substring(0, 2) + '/' + m.substring(2) + '/';
    }

    export function stateStr(num: number | Work) {
        return $state[typeof num === 'number' ? num : num.state];
    }

    // 리스트 로딩
    export function list(query: string): Promise<ServerData<Work>> {
        return $get('/work/list?' + query).then((e: ServerData<any>) => {
            e.contents = e.contents.map(a => {
                let work = new Work(a);

                // 이미지가 같이 담겨온다.
                work.img = new WorkFile(a.draft);
                return work;
            });
            return e;
        });
    }


    export function update(val, work: Work) {
        return $post('/work/db/update/' + work.id, val).then(() =>  $extend(work, val));
    }

    // 전체 로딩
    export function get(workUUID: string): Promise<Work> {
        return $get('/work/view?uuid=' + workUUID).then((data: { work: any, items: any[] }) => {

            if(data.work) {
                let work = new Work(data.work);
                data.items.forEach(item => new WorkItem(work, item));
                return work;
            }
            else return null;
        })
    }
}


export namespace Customer {
    export function save(data) {
        return $post('/work/db/customer', data);
    }
}


/*
 * 메모 입출력은 그냥 간단하게 하자
 */
export namespace WorkMemo {

    export function save(work: Work, memo: WorkMemo): Promise<WorkMemo> {
        return $post('/work/db/memo/' + work.id, $assemble(memo))
            .then((id) => {
                memo.id = id;
                return memo;
            });
    }

    export function remove(memo: WorkMemo, work: Work): Promise<any> {
        return $delete('/work/db/memo/' + memo.id + '/' + work.id);
    }
}

export namespace WorkItem {
    export function save(v: WorkItem, workId): Promise<any> {
        return $post('/work/db/item/' + workId, $assemble(v)).then(id => {
            v.id = id;
        });
    }

    export function priority(ids: number[]) {
        return $post('/work/db/item/priority', ids).then( v => {
            console.log(v);
        })
    }

    export function remove(v: WorkItem): Promise<any> {
        return $delete('/work/db/item/' + v.id);
    }
}

export namespace WorkFile {


    // uuid값 받아옴과 동시에 서버에 progressMap 생성
    // progressId값으로 쓰이는 해시값이 파일 저장 이름이다.
    function $get()                     // ① 처음 progress id를 받아올때
    function $get(progressId: string)   // ② 받아온 id로 진행상황 받아올때
    function $get(id?) {
        return new Promise((o, x) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', '/upload/progress' + (id ? '/' + id : ''));
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        o(id ? parseInt(xhr.responseText) : xhr.responseText);
                    }
                }
            }
            xhr.send(null)
        });
    }

    // File Upload Logic
    function $upload(data: FormData, handler: UploadHandler) {

        // ① 고유 키를 받아온다.
        return $get().then((id) => {

            let
                total = 0,      // uploading한 총 파일용량
                time = 10,      // sending 체크 시간
                xhr = new XMLHttpRequest(),

                // 서버측 다운로드 경과
                tHandler = () => {
                    $get(id).then((d) => {
                        if (total !== -1 && total !== d) {
                            handler.sending(d, total);
                            setTimeout(tHandler, time);
                        } else {
                            handler.sending(total, total);
                        }
                    })
                };


            // 서버 send progress
            xhr.upload.onprogress = (e: ProgressEvent) => {
                handler.uploading(e.loaded, e.total);
            }

            xhr.upload.onloadend = (e: ProgressEvent) => {
                handler.uploading(e.total, e.total);
                total = e.total;
                setTimeout(tHandler, time);
            }

            return new Promise((o, x) => {
                xhr.open('POST', '/upload/file/' + id);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            total = -1;     // 위의 setTimeout 핸들러를 멈추기 위한 값
                            o(id);
                        }
                    }
                }
                xhr.send(data);
            });
        })
    }

    export interface UploadHandler {
        uploading(load: number, total: number)

        sending(load: number, total: number)

        done();
    }

    export function uploadFile(path: string, file: UploadObject, handler: UploadHandler): Promise<string> {
        let formData = new FormData();
        formData.append('path', 'D:/work/' + path);
        formData.append('file', file.data, file.name);
        return $upload(formData, handler).then((id) => {
            handler.done();
            return id;
        });
    }


    export function uploadTest(data) {
        let formData = new FormData();
        formData.append('file', data, data['name']);
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
            }
        }
        xhr.open('POST', '/upload/file/test', true);
        xhr.send(formData);
    }


    export function saveFile(type: string, ownId: number, workFile: WorkFile): Promise<WorkFile> {
        return $post('/work/db/' + type + '/' + ownId, $assemble(workFile))
            .then(id => workFile.setId(id));
    }

    export function removeFile(type: string, id: number): Promise<any> {
        return $delete('/work/db/' + type + '/' + id);
    }

    export function create(file: UploadData, orig_name, save_name: string) {
        let i = orig_name.lastIndexOf('.')
        return new WorkFile({
            datetime: new Date(),
            original_name: orig_name.slice(0, i),
            save_name: save_name,
            filetype: orig_name.slice(i + 1),
            size: file.size,
            content_type: file.type
        });
    }
}