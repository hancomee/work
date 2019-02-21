import "../../lib/core/component/toggle";
import {Customer, Work, WorkFile, WorkItem, WorkMemo} from "./_core/Work";
import {Calendar} from "../../lib/core/calendar";
import {$extend} from "../../lib/core/core";
import {Formats} from "../../lib/core/format";
import {FileUpload} from "./_support/FileUpload";
import {Screen} from "./view/Screen";
import {_filter, _forEach, _makeArray, _map, _move, _reduce} from "../../lib/core/_func/array";
import {DOM} from "../../lib/core/dom";
import {Events, EventsGroup, iEvents} from "../../lib/core/events";
import {Access} from "../../lib/core/access";
import {FormEvent} from "../../lib/core/form/FormEvent";
import {_recieveFiles} from "../../lib/core/form/_recieveFiles";
import {_replaceHTML} from "../../lib/core/_html/replaceHTML";
import {DragSort} from "./view/DragSort";
import {__adjustTo} from "../../lib/core/position";
import {patseImage} from "../../lib/core/support/patseImage";
import {ImageScreen} from "./view/ImageScreen";
import {ViewForm} from "./view/ViewForm";
import {Mapping} from "./_support/Mapping";
import createHTML = DOM.createHTML;
import dataEvent = Events.dataEvent;
import access = Access.access;
import className = DOM.className;
import number = Formats.number;
import eventProperty = Events.eventProperty;
import simpleTrigger = Events.simpleTrigger;
import {ConfirmBox} from "./_support/ComfirmBox";
import filesize = Formats.filesize;

class EventObject {

    static $dispatcher = (e: MouseEvent) => new EventObject(e);


    index: number
    type: string
    mapper: HTMLElement
    target: HTMLElement
    eventTarget: HTMLElement
    print: HTMLElement
    image: HTMLImageElement
    name: string                    // 이벤트시 CURD를 찾기 위한 key
    mapping: string

    constructor(public e: MouseEvent) {
        this.eventTarget = <HTMLElement>e.target;
    }
}


type CURD_TYPE = {
    update?(data, own): Promise<any>
    create?(data, own): Promise<any>
    remove?(data, own): Promise<any>
    upload?(file: File, fileupload: FileUpload, own: any): Promise<any>
}


function $init($uuid: string, $path: string, $work: Work) {

    let
        {body} = document,
        element = <HTMLElement>document.getElementById('view'),

        $uploadProgress = new FileUpload(document.getElementById('file-upload')),
        $screen = new Screen(document.getElementById('screen'), $path),
        $imageScreen = new ImageScreen(document.getElementById('image-screen')),
        $confirm = new ConfirmBox(document.getElementById('confirm-box')),
        $mapping: Mapping,


        /*
         *   data-event-register="{name}"
         *
         */
        eventRegister = {

            $attach(e: HTMLElement) {
                _forEach(e.querySelectorAll('[data-event-register]'), (e) => {
                    this[e.getAttribute('data-event-register')](e);
                });
                return e;
            },

            // **************** 이벤트 종류
            number: FormEvent.numbers,

            // 메모 textarea와 버튼을 일원화시키기
            memoForm(ele: HTMLElement) {
                let textarea = <HTMLTextAreaElement>ele.querySelector('textarea'),
                    tHandler = () => className(ele, 'active', !!textarea.value);
                textarea.addEventListener('keyup', tHandler);
                textarea.addEventListener('change', tHandler);
            },

            /*
             *  아이템 재정렬 이벤트
             */
            itemSort(mapper: HTMLElement) {
                let
                    r_tr = /tr/i,
                    $form = $viewForms[mapper.getAttribute('data-mapper')],
                    sort = new DragSort(),
                    tbody = mapper.getElementsByTagName('tbody')[0],
                    target: HTMLElement,
                    index: number,
                    items: WorkItem[],

                    sortHandler = (ele: HTMLElement, moveUp: boolean) => {
                        if (moveUp) tbody.insertBefore(target, ele);
                        else tbody.insertBefore(ele, target);
                    },

                    endHandler = () => {
                        target && className(target, ['sort-active'], false);
                        upEvent.off();
                        sort.off();

                        let idx = _makeArray(tbody.getElementsByTagName('tr')).indexOf(<any>target);

                        if (index !== idx) {
                            let values = _move(items, index, idx);
                            WorkItem.priority(values.map(v => v.id)).then(v => {
                                $work.items = values;
                                $mapping.$render(mapper);
                            })

                        }
                    },

                    upEvent = new EventsGroup().off()
                        .register(document, 'mouseup', endHandler)
                        .register(document, 'dragend', endHandler);


                // ① 마우스다운으로 이벤트 시작
                mapper.addEventListener('mousedown', (e) => {

                    target = <HTMLElement>e.target;

                    if (target.hasAttribute('draggable') ||
                        target.parentElement.hasAttribute('draggable')) {

                        // ① 열려있는 폼을 닫는다.
                        $form.detach();

                        // ② <tr>을 찾는다.
                        while (!r_tr.test(target.tagName))
                            target = target.parentElement;

                        // ③ <tr class="sort-active">
                        className(target, ['sort-active'], true);

                        // ④ 현재위치 저장
                        items = $work.items;
                        index = items.indexOf(access($work, target.getAttribute('data-mapping')));

                        upEvent.on();
                        sort.on(
                            _filter(_makeArray(tbody.getElementsByTagName('tr')), v => v !== target),
                            sortHandler
                        );
                    }
                });

            },

            /*
             *  ctrl + v 로 시안붙이기
             */
            pasteImage(ele: HTMLElement) {

                patseImage(ele, (a) => {
                    let workFileData: UploadObject[];
                    if (a.kind === 'file') workFileData = [fileTo(a.file)];
                    else if (a.kind === 'blob') workFileData = [blobTo(a.blob)];
                    else return;
                    $fileUpload('draft', $screen.item.id, workFileData, (workFile) => {
                        $screen.item.addDraft(workFile);
                        $screen.render();
                    })
                });
            },

            /*
             *  참고파일 이미지 크게 보기
             */
            imageScreen(ele: HTMLElement) {

                let r = /img/i,
                    handler = (image: HTMLImageElement) => {
                        let parent = image.parentElement;
                        $imageScreen
                            .on()
                            .putImage(image)
                            .onClose = () => parent.appendChild(__adjustTo(parent, image, true));
                    };

                ele.addEventListener('click', (e) => {
                    let image = <HTMLImageElement>e.target;
                    r.test(image.tagName) && handler(image);
                });
            },
        },


        /*
         *  각 데이터를 수정하는 폼 엘리먼트
         *  각 폼은 자체적으로 검증시스템을 갖추고 있다.
         */
        $viewForms = (function (list) {
            let $forms: { [index: string]: ViewForm } = {};
            // <script data-form="{}"> 순회
            _forEach(list, (e: HTMLScriptElement) => {
                $forms[e.getAttribute('data-form')] =
                    new ViewForm(eventRegister.$attach(createHTML(e.innerText)));
            });
            return $forms;
        })(document.head.querySelectorAll('script[data-form]')),

        /*
         *  HTML문자열
         */
        $$templates = (function (list) {
            let result = {};
            _forEach(list, (e: HTMLScriptElement) => {
                result[e.getAttribute('data-template')] = _replaceHTML(e.innerText);
            });
            return result;
        })(document.head.querySelectorAll('[data-template]')),

        $each: MappingTemplate = (function (list) {
            let $templates = {};
            _forEach(list, (e: HTMLScriptElement) => {
                let name = e.getAttribute('data-each'),
                    html = createHTML(e.innerText);
                $templates[name] = () => html.cloneNode(true);
            });
            return $templates;
        })(document.querySelectorAll('script[data-each]')),


        fileTo = (file: File) => ({name: file.name, data: file}),
        blobTo = (blob: Blob) => {
            let [, type] = blob.type.split('/');
            return {data: blob, name: 'blob.' + (type === 'jpeg' ? 'jpg' : type)}
        },
        $fileUpload = (type: string, ownId, files: UploadObject[], handler) => {

            $uploadProgress.init(files.length).on();

            // ② files 순회
            _reduce(files, (promise, file, i) => {
                return promise.then(() => {
                    return WorkFile
                        .uploadFile('files',
                            file, $uploadProgress.start(file.name, i))
                        .then(id => WorkFile.saveFile(type, ownId,
                            WorkFile.create(file.data, file.name, id)))
                        .then(workFile => handler(workFile));
                })
            }, <Promise<any>>Promise.resolve())
                .then(() => $uploadProgress.off());
        },


        /*
         *  data-val="prop | {directive}"
         */
        $directive = {
            number(ele: HTMLElement, v) {
                ele.textContent = number(v);
            },
            datetime(ele: HTMLElement, v) {
                if (v) ele.textContent = Calendar.format(v, 'yyyy-MM-dd(E) HH:mm');
            },
            len(ele: HTMLElement, v: number) {
                let p = ele.parentElement;
                if (v > 0) p.classList.add('active');
                else p.classList.remove('active');
                ele.textContent = v.toString();
            },
            href(ele: HTMLAnchorElement, v) {
                ele.href = ele.getAttribute('data-href') + '/' + v;
            },
            fileSize(ele: HTMLElement, v) {
                ele.textContent = filesize(v);
            },
            /*
             *  인쇄파일 클릭시 나타나는 드롭다운 엘리먼트를 직접 생성
             */
            print(ele: HTMLElement, v: WorkItem) {

                let {print} = v,
                    btn = <HTMLSpanElement>ele.getElementsByTagName('span')[0],
                    dropdown = <HTMLDivElement>ele.getElementsByClassName('dropdown-menu')[0];

                if (print.length) {
                    btn.classList.add('active');
                    btn.setAttribute('data-toggle', 'dropdown');
                    dropdown.innerHTML = print.map((p, i) =>
                        $$templates['print']({
                            index: i, data: p,
                            path: $path + p.getSaveName() + '?attachment=' + p.getOrigName()
                        })
                    ).join('');
                } else {
                    btn.classList.remove('active');
                    btn.removeAttribute('data-toggle');
                }
            },
            draft(ele: HTMLElement, v: WorkItem) {
                if (v.draft.length) {
                    ele.classList.add('active')
                }
            },

            // 참고파일 렌더링
            refThumb(ele: HTMLAnchorElement, v: WorkFile) {

                // ① 이미지 파일일 경우
                if (v.content_type.indexOf('image') !== -1) {

                    ele.classList.remove('file-icon');

                    let image = new Image();
                    image.onload = () => {
                        ele.appendChild(__adjustTo(ele, image, true));
                        image.onload = null;
                    }
                    image.src = $path + v.getSaveName();
                }
                // ② 일반 파일
                else {
                    ele.classList.add('file-icon-' + v.filetype);
                    ele.href = $path + v.getSaveName() + '?attachment=' + v.getOrigName();
                }
            },
        },


        /*
         *  실제 서버에 데이터를 입력, 변경, 수정하는 로직을 담은 핸들러.
         *  또한 전역적으로 활용되는 Work를 최신 상태로 유지시키는 역할을 한다.
         *
         */
        CURD: { [index: string]: CURD_TYPE } = {
            customer: {
                update(data, own: Customer) {
                    data['id'] = own.id;
                    return Customer.save(data)
                        .then(() => $extend(own, data))
                }
            },
            text: {
                update(data, own: Work) {
                    return Work.update(data, own);
                },
            },
            title: {
                update(data, own: Work) {
                    return Work.update(data, own);
                },
            },
            memo: {
                create(data, obj: Work) {
                    let memo = new WorkMemo({
                        value: data,
                        datetime: new Date()
                    });
                    return WorkMemo.save(obj, memo)
                        .then(memo => obj.addMemo(memo));
                },
                update(data, own: WorkMemo) {
                    console.log(data);
                    data['id'] = own.id;
                    return WorkMemo.save(own.work, data)
                        .then(() => own.value = data.value);
                },
                remove(own: WorkMemo, work: Work) {
                    return WorkMemo.remove(own, work).then(v => {
                        work.removeMemo(own);
                    })
                },
            },

            items: {
                update(data, own: WorkItem) {
                    let {work} = own;
                    data['id'] = own.id;
                    return WorkItem.save(data, work.id)
                        .then(v => $extend(own, data).work.compute());
                },
                create(obj: any, work: Work) {
                    obj['priority'] = work.item_len;
                    return WorkItem.save(new WorkItem(work, obj), work.id);
                },
                remove(item: WorkItem, work: Work) {
                    return WorkItem.remove(item).then(v => {
                        work.removeItem(item);
                    });
                },
            },

            /*
             *   여기서는 참고파일만 취급한다.
             *   시안과 인쇄파일은 Screen에서 해결한다.
             */
            refs: {
                remove(own: WorkFile, work: Work) {
                    return WorkFile.removeFile('ref', own.id).then(v => {
                        work.removeRef(own);
                    });
                }
            },
        };


    // ************************************ Start ************************************ //
    $mapping = new Mapping($work, $directive, $each);

    document.title = $work.title;

    function $eventTrigger(type: string, target: HTMLElement) {
        let e = document.createEvent('Event');
        e.initEvent(type, false, true);
        target.dispatchEvent(e);
    }

    /*
     *
     */
    let $dataEvent: iEvents.dataEvent.directive<EventObject> = {

        /*
         *  수정 폼 이벤트
         *  여기서는 DOM의 변화만을 다룬다.
         *
         *  name    : [data-mapper] 값
         *  mapper  : [data-mapper] 엘리먼트
         *  mapping : data-event 엘리먼트로부터 가장 가까운 곳에 있는 [data-mapping] 값이다.
         *
         */
        // 수정 버튼 클릭시
        modify({mapper, mapping, name, target}) {
            let forms = $viewForms[name].reset(access($work, mapping));
            // mapping이 undefined이거나 null이면 해당 키워드가 문자열로 입력된다. 그럼 문제된다.
            forms.element.setAttribute('data-form-mapping', mapping || '');
            forms.prepend(target);
        },

        // 확인 버튼 클릭시
        confirm(obj) {

            let
                {name, mapper} = obj,
                forms = $viewForms[name],
                {element} = forms;

            // 수정
            if (element.hasAttribute('data-form-mapping')) {
                let mapping = element.getAttribute('data-form-mapping');
                CURD[name].update(forms.values(), access($work, mapping)).then(v => {
                    forms.detach();
                    $mapping.$render(mapper).$follow(name);
                });
            }
            // 신규
            else {
                CURD[name].create(forms.values(), $work).then(v => {
                    forms.detach();
                    $mapping.$render(mapper).$follow(name);
                });
            }
        },

        // 삭제버튼 클릭시
        remove({mapper, mapping, name, e, eventTarget}: EventObject) {
            eventTarget.classList.add('confirm-active');
            $confirm.on(e, (flag) => {
                if (flag) {
                    CURD[name].remove(access($work, mapping), $work).then(v => {
                        $mapping.$render(mapper).$follow(name);
                    });
                }
                eventTarget.classList.remove('confirm-active');
            });
        },

        // ************************ ▼ Custom Event ▼ ************************ //
        // 아이템추가하기
        addItem({mapper, name}: EventObject) {
            let forms = $viewForms[name];
            forms.element.removeAttribute('data-form-mapping');
            forms.reset().appendTo(mapper.querySelector('[data-each]'));
        },

        // 메모추가하기
        addMemo({mapper, name, target}: EventObject) {
            let textarea = <HTMLTextAreaElement>target.querySelector('textarea'),
                {value} = textarea;

            // 데이터가 전송중일때는 클릭이 안되게 한다.
            if (!value || textarea.hasAttribute('data-sending')) return;
            textarea.setAttribute('data-sending', 'true');

            CURD.memo.create(value, $work).then(v => {
                textarea.value = '';
                $eventTrigger('change', textarea);
                $mapping.$render(mapper).$follow(name);
                textarea.removeAttribute('data-sending');
            });
        },

        // 시안파일, 인쇄파일
        screen({name, mapping, mapper}: EventObject) {
            $screen.on(access($work, mapping), mapper);
        },


        // ************************* ▼ 파일 업로드 ▼ ************************* //
        // 참고파일 업로드
        upload({mapper, name}) {
            _recieveFiles((files) => {
                $fileUpload('ref', $work.id, _map(files, fileTo), (file: WorkFile) => {
                    $work.addRef(file);
                    $mapping.$render(mapper).$follow(name);
                });
            });
        },

        // [screen] 시안파일, 인쇄파일 업로드
        screenFile({name, mapping, type}: EventObject) {
            let {item} = $screen;
            _recieveFiles((files) => {
                $fileUpload(type, item.id, _map(files, fileTo), (file: WorkFile) => {
                    if (type === 'print') item.addPrint(file);
                    else item.addDraft(file);
                    $screen.render();
                    $mapping.$render($screen.mapper);
                });
            });
        },

        // 시안 지우기
        removeDraft() {
            let {img, item} = $screen;
            WorkFile.removeFile('draft', img.id).then(v => {
                item.removeDraft(img);
                $screen.render();
                if (!item.draft.length)
                    $mapping.$render($screen.mapper);
            });
        },
        // 인쇄파일 지우기
        removePrint({mapping, index, target, print, e, eventTarget}) {
            eventTarget.classList.add('confirm-active');

            $confirm.on(e, (flag) => {

                if (flag) {
                    let item: WorkItem = access($work, mapping),
                        val = item.print[index];

                    WorkFile.removeFile('print', val.id).then(v => {
                        item.removePrint(val);
                        if (!item.print.length) {
                            $mapping.$render(target);
                            simpleTrigger(print, 'dropdown-close');
                        }
                        else {
                            // mapping을 갱신해야 하므로, 다시 그린다.
                            $directive.print(print, item);
                        }
                    });
                }
                eventTarget.classList.remove('confirm-active');
            });

        },
        // ************************* ▲ 파일 업로드 ▲ ************************* //


        // ************************ ▲ Custom Event ▲ ************************ //

    };

    //************************************** ▼ Events ▼ **************************************//
    dataEvent(body, 'click', 'data-event',
        EventObject.$dispatcher,
        (t: HTMLElement, o: EventObject) => {
            let p;
            eventProperty(t, o);
            if (!o.mapping && (p = t.getAttribute('data-mapping'))) {
                o.mapping = p;
            }
            if ((p = t.getAttribute('data-mapper')) != null) {
                o.mapper = t;
                o.name = p;
                return false;
            }
        }, $dataEvent);
    //************************************** ▲ Events ▲ **************************************//

    $mapping.$render(element);
    $mapping.$render(document.querySelector('nav'));

    // 폼 이벤트
    eventRegister.$attach(body);
}


Work.get(/([^\/]+)\/*$/.exec(location.pathname)[1]).then($work => {
    if ($work) {
        console.log($work);
        // Work.toPath($work.uuid)
        $init($work.uuid, 'http://localhost/local/work/files/', $work);
    }
});



