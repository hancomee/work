

// 파일 업로드 창
import {WorkFile} from "../_core/Work";
import UploadHandler = WorkFile.UploadHandler;
import {Arrays} from "../../../lib/core/_array";
import _forEach = Arrays.__forEach;

export class FileUpload implements UploadHandler {
    current: HTMLElement
    total: HTMLElement
    bar: HTMLElement
    filename: HTMLElement

    private _sending = false;

    private rr: number
    /*
     *  서버 송출하는 upload 진행도가 전체에서 차지할 비율
     *  up      : 브라우저 업로드
     *  send    : 서버측 다운로드
     *  rr = 100 * up;
     */
    constructor(public element: HTMLElement, private up = .6, private send = 1 - up) {
        this.rr = 100 * up;
        _forEach(element.querySelectorAll('[data-prop]'), e => {
            this[e.getAttribute('data-prop')] = e;
        });
    }

    init(total: number) {
        this._sending = true;
        this.current.textContent = '1';
        this.total.textContent = total.toString();
        this.bar.style.width = '0%';
        return this;
    }

    uploading(loaded: number, total: number) {
        this.loading(Math.floor(loaded / total * 100 * this.up));
        return this;
    }

    sending(loaded: number, total: number) {
        this.loading(this.rr + Math.floor(loaded / total * 100 * this.send));
        return this;
    }

    done() {
        this.loading(100);
        this._sending = false;
        return this;
    }

    isSending() {
        return this._sending;
    }

    private loading(percent: number) {
        this.bar.style.width = percent + '%';
    }

    start(name: string, index: number) {
        this.current.textContent = (index + 1).toString();
        this.filename.textContent = name;
        this.bar.style.width = '0%';
        return this;
    }

    on() {
        this.element.classList.add('on');
        return this;
    }

    off() {
        this.element.classList.remove('on');
        return this;
    }
}