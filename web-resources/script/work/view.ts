import {Customer, Work, WorkFile, WorkItem, WorkMemo} from "./_core/Work";
import {$extend} from "../../lib/core/_core";
import {FileUpload} from "./_support/FileUpload";
import {Screen} from "./view/Screen";
import {Events, EventsGroup} from "../../lib/core/_events";
import {Access} from "../../lib/core/_access";
import {DragSort} from "./view/DragSort";
import {ImageScreen} from "./view/ImageScreen";
import {ModifyForm} from "./_support/ModifyForm";
import {Mapping} from "../../lib/core/_dom/Mapping";
import {ConfirmBox} from "./_support/ComfirmBox";
import {__findByTag, __findAll, __findById} from "../../lib/core/_dom/_selector";
import {$bill} from "./view/Bill";
import {r_number} from "../../lib/core/_regexp/number";
import access = Access.__access;
import simpleTrigger = Events.__$simpleTrigger;
import acceptKeys = Events.__$acceptKeys;
import {mapperDispatcher} from "./_support/dispatcher";
import {Formats} from "../../lib/core/_format";
import number = Formats.__number;
import {Calendar} from "../../lib/core/support/Calendar";
import filesize = Formats.__filesize;
import {Arrays} from "../../lib/core/_array";
import _forEach = Arrays.__forEach;
import _makeArray = Arrays.__makeArray;
import _move = Arrays.__move;
import _filter = Arrays.__filter;
import {__replaceHTML} from "../../lib/core/_html/_compile";
import _reduce = Arrays.__reduce;
import _map = Arrays.__map;
import {__selectA} from "../../lib/core/_dom/_select";
import {__className, __createHTML} from "../../lib/core/_dom/_commons";
import {__pasteImage} from "../../lib/core/support/patseImage";
import DATA_EVENT_DIRECTIVE = Events.DATA_EVENT_DIRECTIVE;
import {FormEvent} from "../../lib/core/_form/_formEvents";
import {_recieveFiles} from "../../lib/core/_form/_recieveFiles";
import __$attrEvent = Events.__$attrEvent;

declare let __adjustTo;

class EventObject {

    index: number
    type: string
    mapper: HTMLElement
    target: HTMLElement
    print: HTMLElement
    image: HTMLImageElement
    name: string                    // 이벤트시 CURD를 찾기 위한 key
    mapping = ''

    constructor(public e: MouseEvent, public eventTarget: HTMLElement) {
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
        $container = <HTMLElement>document.getElementById('view'),
        nav = __findByTag(document.body, 'nav', 0),

        $uploadProgress = new FileUpload(document.getElementById('file-upload')),
        $screen = new Screen(document.getElementById('screen'), $path),
        $imageScreen = new ImageScreen(document.getElementById('image-screen')),
        $confirm = new ConfirmBox(document.getElementById('confirm-box')),


        /*
         *  data-directive="prop | {directive}"
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
            // 견적서로 가는 href 작성
            href(ele: HTMLAnchorElement, v) {
                ele.href = '/work/bill?uuid=' + v + '&type=' +
                    ele.getAttribute('data-href');
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
                    dropdown.innerHTML = print.map((p, i) => {
                        return $$templates['print']({
                            index: i, data: p,
                            path: '/workdata/' + $path + p.getSaveName() + '?attachment=' + p.getOrigName()
                        })
                    }).join('');
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
                    image.src = '/workdata/' + $path + v.getSaveName();
                }
                // ② 일반 파일
                else {
                    ele.classList.add('file-icon-' + v.filetype);
                    ele.href = '/workdata/' + $path + v.getSaveName() + '?attachment=' + v.getOrigName();
                }
            },
        },

        $mapping = new Mapping()
            .setData($work)
            .addDirective($directive)
            .addTemplate(Mapping.createTemplates(document.head)),

        /*
         *   data-pre-processor="{name}"
         *
         */
        preProcessor = {

            $attach(e: HTMLElement) {

                if (e.hasAttribute('data-pre-processor'))
                    this[e.getAttribute('data-pre-processor')](e);

                _forEach(e.querySelectorAll('[data-pre-processor]'), (e) => {
                    this[e.getAttribute('data-pre-processor')](e);
                });
                return e;
            },


            state(ele: HTMLElement) {

                let {$state} = Work,
                    [span, ul] = __selectA(ele, ['<span>[0]', '<ul>[0]']),
                    current = $work.state.toString(),
                    $active = (i: string) => {
                        span.textContent = $state[current = i];
                        _forEach(ul.children, (e: HTMLElement) => {
                            if (e.getAttribute('data-dismiss') == i)
                                e.classList.add('active');
                            else e.classList.remove('active');
                        });
                    };

                ul.innerHTML = $state.reduce((r, v, i) => {
                    r[i] = '<li data-dismiss="' + i + '">' + v + '</li>';
                    return r;
                }, []).join('');

                ul.addEventListener('click', (e) => {
                    let i = e.target['getAttribute']('data-dismiss');
                    if (current !== i)
                        Work.updateState($work.id, i).then(() => {
                            $active(i);
                        });
                });

                $active(current);


            },
            // 작업 삭제 버튼
            remove(ele: HTMLElement) {
                ele.addEventListener('click', (e) => {
                    if ($confirm.eventTarget !== e.target)
                        $confirm.on(e.pageX, e.pageY, <HTMLElement>e.target, (flag) => {
                            if (flag) Work.remove($work.id).then(() => {
                                location.href = '/work/list';
                            })
                        })
                });
            },

            // 숫자만 써지게 한다.
            number: FormEvent.numbers,

            /*
             *   ① count와 price가 입력될때마다 vat, total을 계산해넣는다.
             *   ② vat 자체를 수정할 경우에는 total만 변경한다
             */
            compute(tr: HTMLElement) {
                // [count, price, vat, total]
                let inputs = __findAll(tr, '[data-compute]').reduce((r, v) => {
                        r[v.getAttribute('data-compute')] = v;
                        return r;
                    }, []),
                    read = (value: string) => {
                        if (r_number.test(value)) return parseInt(value);
                        return 0;
                    },
                    processor = [
                        (val: number[]) => val[0] == null ? read(inputs[0].value) : val[0],
                        (val: number[]) => val[1] == null ? read(inputs[1].value) : val[1],
                        (val: number[]) => {
                            if (val[2] == null) {
                                let [c, p] = val;
                                inputs[2].value = (val[2] = Math.ceil((c * p) / 10)).toString()
                            }
                            return val[2];
                        },
                        (val: number[]) => inputs[3].value = (val[0] * val[1] + val[2]) + ''
                    ];
                // keyup 이벤트
                _forEach(inputs, (input, i) => {
                    acceptKeys(input, (val) => {
                        if (!val.trim()) val = '0';
                        if (r_number.test(val)) {
                            let values = [];
                            values[i] = read(val);
                            _forEach(processor, (func, i) => values[i] = func(values))
                        }
                    }, false);
                });

            },

            // 메모 textarea와 버튼을 일원화시키기
            memoForm(ele: HTMLElement) {
                let textarea = <HTMLTextAreaElement>ele.querySelector('textarea'),
                    tHandler = () => __className(ele, 'active', !!textarea.value);
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
                        target && __className(target, ['sort-active'], false);
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
                        __className(target, ['sort-active'], true);

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

                __pasteImage(ele, (a) => {
                    let workFileData: UploadObject[];
                    if (a.kind === 'file') workFileData = [fileTo(a.file)];
                    else if (a.kind === 'blob') workFileData = [blobTo(a.blob)];
                    else return;
                    $fileUpload('draft', $screen.item.id, workFileData, (workFile) => {
                        $screen.item.addDraft(workFile);
                        $screen.render();
                        $mapping.$render($screen.mapper);
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
            let $forms: { [index: string]: ModifyForm } = {};
            // <script data-form="{}"> 순회
            _forEach(list, (e: HTMLScriptElement) => {
                $forms[e.getAttribute('data-form')] =
                    new ModifyForm(preProcessor.$attach(__createHTML(e.innerText)));
            });
            return $forms;
        })(document.head.querySelectorAll('script[data-form]')),

        /*
         *  HTML문자열
         */
        $$templates = (function (list) {
            let result = {};
            _forEach(list, (e: HTMLScriptElement) => {
                result[e.getAttribute('data-template')] = __replaceHTML(e.innerText);
            });
            return result;
        })(document.head.querySelectorAll('[data-template]')),


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
                        .uploadFile($path,
                            file, $uploadProgress.start(file.name, i))
                        .then(id => WorkFile.saveFile(type, ownId,
                            WorkFile.create(file.data, file.name, id)))
                        .then(workFile => handler(workFile));
                })
            }, <Promise<any>>Promise.resolve())
                .then(() => $uploadProgress.off());
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
                create(data, work: Work) {
                    let memo = new WorkMemo({
                        value: data,
                        datetime: new Date()
                    });
                    return WorkMemo.save(work, memo)
                        .then(memo => work.addMemo(memo));
                },
                update(data, own: WorkMemo) {
                    data.id = own.id;
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
                    return WorkItem.save(new WorkItem(obj).setWork(work), work.id);
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

    document.title = $work.title;

    function $eventTrigger(type: string, target: HTMLElement) {
        let e = document.createEvent('Event');
        e.initEvent(type, false, true);
        target.dispatchEvent(e);
    }

    /*
     *
     */
    let $dataEvent: DATA_EVENT_DIRECTIVE<EventObject> = {

        $init(data) {
            mapperDispatcher();
        },

        // 수정 버튼 클릭시
        modify({mapper, mapping, name, target}) {
            console.log('mapping:', mapping, 'name:', name);
            let forms = $viewForms[name].reset(access($work, mapping));
            // mapping이 undefined이거나 null이면 해당 키워드가 문자열로 입력된다. 그럼 문제된다.
            forms.element.setAttribute('data-form-mapping', mapping || '');
            forms.prepend(target);
        },

        // 확인 버튼 클릭시
        confirm({name, mapper}) {

            let forms = $viewForms[name],
                {element} = forms;

            // 수정
            if (element.hasAttribute('data-form-mapping')) {
                let mapping = element.getAttribute('data-form-mapping');
                CURD[name].update(forms.values(), access($work, mapping)).then(v => {
                    forms.detach();
                    $mapping.$render(mapper);
                    $mapping.$follow(name);
                });
            }
            // 신규
            else {
                CURD[name].create(forms.values(), $work).then(v => {
                    forms.detach();
                    $mapping.$render(mapper);
                    $mapping.$follow(name);
                });
            }
        },

        // 삭제버튼 클릭시
        remove({mapper, mapping, name, e, eventTarget}: EventObject) {
            if ($confirm.eventTarget !== eventTarget)
                $confirm.on(e.pageX, e.pageY, eventTarget, (flag) => {
                    if (flag) {
                        CURD[name].remove(access($work, mapping), $work).then(v => {
                            $mapping.$render(mapper);
                            $mapping.$follow(name);
                        });
                    }
                });
        },

        // ************************ ▼ Custom Event ▼ ************************ //
        // 아이템추가하기
        addItem({mapper, name}: EventObject) {
            let forms = $viewForms[name];
            forms.element.removeAttribute('data-form-mapping');
            forms.reset().appendTo(mapper.querySelector('[data-template]'));
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
                $mapping.$render(mapper);
                $mapping.$follow(name);
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
                    $mapping.$render(mapper);
                    $mapping.$follow(name);
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
                    $mapping.$render($screen.mapper);   // 해당 아이템 엘리먼트도 갱신
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

            $confirm.on(e.pageX, e.pageY, eventTarget, (flag) => {

                if (flag) {
                    let item: WorkItem = access($work, mapping),
                        val = item.print[index];

                    WorkFile.removeFile('print', val.id).then(v => {
                        item.removePrint(val);
                        if (!item.print.length) {
                            $mapping.$render(target);
                            simpleTrigger(print, 'dropdown-close');
                        } else {
                            // mapping을 갱신해야 하므로, 다시 그린다.
                            $directive.print(print, item);
                        }
                    });
                }
            });

        },
        // ************************* ▲ 파일 업로드 ▲ ************************* //


        // ************************ ▲ Custom Event ▲ ************************ //

    };

    //************************************** ▼ Events ▼ **************************************//
    __$attrEvent($container, 'click', 'data-event', EventObject, $dataEvent);
    //************************************** ▲ Events ▲ **************************************//

    $mapping.$render($container);
    $mapping.$render(document.querySelector('nav'));

    // 폼 이벤트
    preProcessor.$attach(body);
}


Work.get(/([^\/]+)\/*$/.exec(location.pathname)[1]).then($work => {
    if ($work) {
        $init($work.uuid, Work.toPath($work.uuid), $work);

        // 견적서 띄우기
        (function (nav: HTMLElement) {
            nav.addEventListener('click', (e) => {
                let type = e.target['getAttribute']('data-bill');
                if (type) $bill($work, type);
            });
        })(__findByTag(document.body, 'nav', 0))

    }
});



