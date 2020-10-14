import {Arrays} from "./_array";
import __forEach = Arrays.__forEach;
import {Access} from "./_access";
import __primitive = Access.__primitive;

type Interceptor = (xml: XMLHttpRequest) => void;


export function __setHeader(lines: string|[string, string][], xhr: XMLHttpRequest): XMLHttpRequest {
    let val = typeof lines === 'string' ? __parseHeader(lines) : lines,
        len = val.length;

    while(len-- >0)
    xhr.setRequestHeader(val[len][0], val[len][1]);

    return xhr;
}

export function __parseHeader(lines): [string, string][] {

    let values: string[] = lines.split('\n'),
        result: any[] = [], pos = 0;

    __forEach(values, val => {
        let i = val.indexOf(':');
        if (i !== -1) {
            let key = val.substring(0, i).trim(),
                value = val.substring(i + 1);
            result[pos++] = [key, value];
        }
    });

    return result;
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

export function $html(url: string, it?: Interceptor): Promise<any> {
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

