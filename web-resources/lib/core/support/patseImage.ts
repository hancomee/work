import {Events, EventsGroup} from "../_events";
import catchKey = Events.__$catchKey;
import {__base64ToBlob} from "../_util/_base64ToBlob";
import {__noop} from "../_snippet/_noop";
import {Arrays} from "../_array";
import _forEach = Arrays.__forEach;

type TransferData = { kind: 'blob' | 'url' | 'file', url?: string, file?: File, blob?: Blob };

let
    r_filename = /\.[^.]+$/,
    r_https = /^https?:\/\//,
    r_img = /img/i,
    r_http = /^http/,
    r_data = /^data:/,

    /*
     *  모든 pasteImage는 하나의 엘리먼트를 공유한다.
     *  ctrl key에 따라 body에 탈착된다.
     */
    $ctrl = (function () {
        let
            $style = {
                overflow: 'hidden',
                position: 'fixed',
                top: '-2px',
                left: '-2px',
                width: '1px',
                height: '1px'
            },

            element = (function (element) {
                let {style} = element, p;
                for (p in $style) style[p] = $style[p];
                element.setAttribute('contenteditable', 'true');
                return element;
            })(document.createElement('div')),

            ctrl = {
                element: element,
                on() {
                    element.textContent = '';
                    document.body.appendChild(element);
                    element.focus();
                },
                off() {
                    document.body.removeChild(element);
                }
            };
        return ctrl;
    })(),

    /*
     *  paste 이벤트시 DataFransferItemList 로딩하기
     *  Promise.all([...])과 같은 역할을 하는 메서드
     */
    readItems = (function () {

        function getAs(item: DataTransferItem, call) {
            if (item.kind === 'string') {
                item.getAsString((v) => {
                    call({kind: 'url', text: v});
                })
            }
            else if (item.kind === 'file') {
                call({kind: 'file', file: item.getAsFile()})
            }
        }

        return (items: DataTransferItemList) => {
            return new Promise<TransferData[]>((resolve, _) => {
                let check: number, len = check = items.length, result: TransferData[] = [];
                while (len-- > 0) {
                    let index = len;
                    getAs(items[index], (d) => {
                        result[index] = d;
                        --check === 0 && resolve(result);
                    });
                }
            });
        }


    })();


function __blobSetName(blob: Blob, name: string) {
    let [, type] = blob.type.split('/');
    if (type === 'jpeg') type = 'jpg';
    blob['name'] = name + '.' + type;
    return blob;
}

export function __pasteImage(ele: HTMLElement, handler: (data: TransferData) => void) {
    let
        ctrl = $ctrl,
        contenteditable = ctrl.element,

        eventGroup = new EventsGroup()

            // ctrl키에 따라 focus()
            .register(catchKey(ele, [17],
                (n) => n === 0 && ctrl.on(),
                () => ctrl.off()))

            // v키를 업하면 곧바로 editElement를 확인한다.
            .register(catchKey(ele, [17, 86], __noop, () => {

                let child = <HTMLImageElement>contenteditable.firstChild,
                    src: string;

                if (child) {

                    // base64는 textNode로 들어온다.
                    if (child.nodeType === 3)
                        src = child.nodeValue;

                    // <img> 태그만 취급한다.
                    if (child.nodeType === 1 && r_img.test(child.tagName)) {
                        src = child.src;

                        // ① http
                        if (r_http.test(src))
                            handler({
                                kind: 'url',
                                url: src
                            })
                    }

                    // ② base64
                    if (r_data.test(src)) {
                        handler({
                            kind: 'blob',
                            blob: __base64ToBlob(src)
                        })
                    }
                }

                //$ctrl.off();  ==> 어차피 위에 있는 ctrl 이벤트에 의해서 호출된다.
            }))

            .register(contenteditable, 'paste', (e: ClipboardEvent) => {
                let transfer = e.clipboardData || window['clipboardData'],
                    items: DataTransferItemList = transfer && transfer.items;

                // ② paste이벤트를 지원하는 경우 File로 받아낸다.
                if (items) {

                    // 이걸 막지 않으면 같은 이미지를 두번 읽어들이게 된다.
                    e.preventDefault();

                    /*
                     *  ★ DataTransfer의 아주 중요한 특징이 있다.
                     *  kind = 'file' 객체의 경우, 이벤트 핸들러를 벗어나자마자 객체의 프로퍼티를 없애버린다.
                     *  따라서 getAsString등에 Promise를 사용하면 안된다.
                     */
                    if (items.length) {

                        readItems(items).then(array => {

                            _forEach(array, (item) => {

                                let {kind, url, file} = item;

                                // ① string && url
                                if (kind === 'url') {
                                    // (1) base64
                                    if (r_data.test(url)) {
                                        handler({
                                            kind: 'blob',
                                            blob: __base64ToBlob(url)
                                        });
                                        return false;
                                    }

                                    // paste에서 주소문자열은 무시하자. @2019-02-12 12:31
                                    // (2) http
                                    // else if (r_http.test(text)) url(text);
                                }

                                // ② file && image
                                else if (kind === 'file') {
                                    if (file.type.indexOf('image') !== -1) {
                                        handler({
                                            kind: 'file',
                                            file: file
                                        });
                                        return false;
                                    }
                                }
                            })
                        });
                    }
                }
            })
            //.off();

    // ele.addEventListener('mouseenter', (e: MouseEvent) => eventGroup.on());
    // ele.addEventListener('mouseleave', (e: MouseEvent) => eventGroup.off());

}

