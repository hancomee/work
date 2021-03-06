import {Template} from "../../../lib/core/_dom/_template";


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

    constructor(
        public element: E,
        public gauge: E,
        public countGauge: E,
        public current: E,
        public fileinfo: E
    ) {
        super('/work/db/upload');
    }

    apply() {
        return this;
    }

    add(file: File, data, handler: HANDLER) {
        let formData = new FormData();
        for (let p in data) {
            formData.append(p, data[p]);
        }
        formData.append('file', file);

        this.values.push([formData, handler]);
        return this.countCheck().upload();
    }

    startup() {
        this.countGauge.style.width = this.gauge.style.width = '0%';
        this.countGauge.textContent = this.gauge.textContent = '';
        this.element.classList.add('on');
        return this;
    }

    progress(load: number, total: number) {
        let {gauge} = this,
            val = Math.floor(load / total * 100) + '%';
        gauge.textContent = gauge.style.width = val;
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
        setTimeout(() => {
            if (!this.uploading) {
                this.element.classList.remove('on');
            }
        }, 500);
        return this;
    }

}