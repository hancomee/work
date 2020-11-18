import {Arrays} from "./_array";
import __forEach = Arrays.__forEach;
import {Access} from "./_access";
import __primitive = Access.__primitive;

type Interceptor = (xhr: XMLHttpRequest) => void;
type HANDLER = (xhr: XHRequest) => void
type XHR_CONFIG = {
    url: string
    method?: "GET" | "POST" | "PUT" | "DELETE" | "HEAD",
    responseType?: XMLHttpRequestResponseType,
    headers?: { [index: string]: string }
    handler: HANDLER,
    sync?: boolean
    data?: { [index: string]: any } | ((xhr: XHRequest) => any)
};

export class XHRequest {

    xhr: XMLHttpRequest;
    responseHeaders

    working = false
    count = 0       // 반복호출시 사용
    private time = -1;

    constructor(public config: XHR_CONFIG) {
    }

    repeat(time = 500) {
        this.time = time;
        return this;
    }

    getHeader(): { [index: string]: string }
    getHeader(key: string): string
    getHeader(key?: string) {
        if (!this.responseHeaders) {
            this.responseHeaders = __parseHeader(this.xhr.getAllResponseHeaders());
        }
        if (key) return this.responseHeaders[key];
        else return this.responseHeaders;
    }

    private open() {

        let xhr = this.xhr = new XMLHttpRequest(),
            {config: {method, responseType, headers, sync, url}} = this;

        xhr.open(method || 'GET', url, sync !== false);

        if (headers)
            for (let p in headers)
                xhr.setRequestHeader(p, headers[p]);

        responseType && (xhr.responseType = responseType);

        return this;
    }

    send(delay = 0) {

        if(this.working) return this;

        this.working = true;

        if(delay > 0) {
            return setTimeout(() => {
                this.working = false;
                this.send(0);
            }, delay);
        }

        let {xhr, config, config: {data}} = this.open();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {

                this.responseHeaders = null;
                config.handler(this);
                this.working = false;

                if (this.time > 0) {
                    this.count++;
                    this.xhr = new XMLHttpRequest();
                    setTimeout(() => this.send(), this.time);
                }
            }
        }

        if (typeof data === 'function') data = data(this);

        if (data) {
            let multiPart = data instanceof FormData;
            multiPart || xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(multiPart ? data as any : JSON.stringify(data));
        } else
            xhr.send(null);

        return this;
    }

    abort() {
        this.time = -1;
        this.xhr.abort();
        return this;
    }

}

export function __setHeader(lines: string | [string, string][], xhr: XMLHttpRequest): XMLHttpRequest {
    let val = typeof lines === 'string' ? __parseHeader(lines) : lines;

    for (let p in val)
        xhr.setRequestHeader(p, val[p]);

    return xhr;
}

//
export function __parseHeader(lines): { [index: string]: string } {

    let values: string[] = lines.split('\n'),
        result = {};

    __forEach(values, val => {
        let i = val.indexOf(':');
        if (i !== -1) {
            let key = val.substring(0, i).trim().toLowerCase(),
                value = val.substring(i + 1);
            result[key] = value;
        }
    });

    return result;
}


/*
 * 리소스가 있는지 확인
 */
export function $blob(url: string, it?: Interceptor): Promise<Blob> {

    return new Promise<Blob>((y, n) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    let data = xhr.response;
                    if (data instanceof Blob) y(data);
                    else y(null);
                }
            }

            xhr.responseType = 'blob';
            xhr.open('GET', url, true);
            it && it(xhr);
            xhr.send(null);
        }
    );
}


export function $head(url: string, it?: Interceptor): Promise<XMLHttpRequest> {
    return new Promise((resolve, error) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                resolve(xhr);
            }

        }
        xhr.open('HEAD', url, true);
        it && it(xhr);
        xhr.send(null);
    });
}

// asdf

export function $text(url: string, it?: Interceptor): Promise<any> {
    return new Promise((resolve, error) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) resolve(xhr.responseText);
                else error(xhr);
            }
        }

        //document.head.getElementsByTagName('meta')[0].charset

        xhr.open('GET', url, true);
        it && it(xhr);
        xhr.send(null);
    });
}

export function $get(url: string, it?: Interceptor): Promise<any> {
    return new Promise((resolve, error) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200)
                    resolve(xhr.responseText && JSON.parse(xhr.responseText));
                else error(JSON.parse(xhr.responseText));
            }
        }
        xhr.open('GET', url, true);
        it && it(xhr);
        xhr.send(null);
    });
}


function $$(method: string, url: string, data?, it?: Interceptor): Promise<any> {
    return new Promise((resolve, error) => {
        let xhr = new XMLHttpRequest(),
            multiPart = data instanceof FormData;

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                let {responseText} = xhr;
                if (xhr.status === 200)
                    resolve(responseText && /[\[\{]/.test(responseText[0]) ? JSON.parse(responseText) : __primitive(responseText));
                else error(JSON.parse(xhr.responseText));
            }
        }

        xhr.open(method, url, true);
        multiPart || xhr.setRequestHeader('Content-Type', 'application/json');
        it && it(xhr);
        xhr.send(data != null ? (multiPart ? data : JSON.stringify(data)) : null);
    });
}

export function $post(url: string, data?, it?: Interceptor): Promise<any> {
    return $$('POST', url, data, it);
}

export function $put(url: string, data?, it?: Interceptor): Promise<any> {
    return $$('PUT', url, data, it);
}

export function $delete(url: string, it?: Interceptor): Promise<any> {
    return new Promise((resolve, error) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) resolve();
                else error(JSON.parse(xhr.responseText));
            }
        }
        it && it(xhr);
        xhr.open('DELETE', url, true);
        xhr.send(null);
    });
}

