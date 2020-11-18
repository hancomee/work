import {Templates} from "../../../lib/core/_dom/_template";
import Template = Templates.Template;


type E = HTMLElement
type HANDLER = (xhr: XMLHttpRequest) => void   //  -1은 에러

abstract class Uploader {

    uploading = false
    values: [FormData, HANDLER][] = [];
    index = 0
    file: File

    constructor(public url: string, public method = 'PUT') {
    }

    empty() {
        return this.index === this.values.length;
    }

    upload() {
        if (!this.uploading && !this.empty())
            this.__upload0();
        return this;
    }

    private __upload0() {

        this.uploading = true;

        let xhr = new XMLHttpRequest(),
            [data, handler] = this.values[this.index];

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this.index++;
                this.countCheck();
                handler(xhr);
                if (this.empty()) {
                    this.done();
                    this.uploading = false;
                    this.values = [];
                    this.index = 0;
                } else {
                    this.__upload0();
                }
            }
        }

        this.file = data.get('file') as File;
        this.startup();

        xhr.upload.onprogress = (e: ProgressEvent) => this.progress(e.loaded, e.total);
        xhr.upload.onloadend = (e: ProgressEvent) => this.progress(e.total, e.total);

        xhr.open(this.method, this.url, true);
        xhr.send(data);
    }

    abstract startup(): this;

    abstract progress(load: number, total: number): this;

    abstract done(): this

    abstract countCheck(): this;
}


@Template('&workUploader', false)
export class WorkUploader extends Uploader {

    static $create: (data?) => WorkUploader

    constructor(public element: E, public gauge: E, public countGauge: E,
                public current: E, public fileinfo: E) {
        super('/work2/view/upload');
    }

    apply() {
        return this;
    }

    add(data: File, json: any, handler: HANDLER)
    add(data: FormData, handler: HANDLER)
    add(data, json, handler?) {
        if(!handler) handler = json;
        else {
            let val = data;
            data = new FormData();
            json && data.append('data', new Blob([JSON.stringify(json)], {type: "application/json"}));
            data.append('file', val);
        }

        this.values.push([data, handler]);
        return this.countCheck().upload();
    }

    progress(load: number, total: number) {
        let {gauge} = this,
            val = Math.floor(load / total * 100) + '%';
        gauge.textContent = gauge.style.width = val;
        return this;
    }

    startup() {
        this.element.classList.add('on');
        return this;
    }

    countCheck() {
        let {countGauge, index, values: {length}, current} = this,
            val = Math.floor(index / length * 100) + '%';
        countGauge.style.width = val;
        current.textContent = index + ' / ' + length;
        return this;
    }

    done() {
        let {countGauge, gauge} = this;
        setTimeout(() => {
            if (!this.uploading) {
                this.element.classList.remove('on');
                countGauge.style.width = gauge.style.width = '0%';
                countGauge.textContent = gauge.textContent = '';
            }
        }, 1000);
        return this;
    }

}