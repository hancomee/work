/**
 * Created by hellofunc on 2017-05-06.
 */

import {__isPlainObject, __isEmptyObject, extend, $extend} from "../_core";
import {Access} from "../_access";
import {Formats} from "../_format";

let hasOwn = {}.hasOwnProperty,
    hasOwnProperty = (obj, value: string) => hasOwn.call(obj, value),
    r_url = /(https?:\/\/.*?\/)?([^\?]+)\??([^#]+)?#?(.*)/;


export class Search implements iLocation.iSearch {

    reset(search = location.search) {
        return this.extend(Search.toObject(search))
    }

    resetHash() {
        return this.reset(location.hash.slice(1));
    }

    extend(obj: {}) {
        let p;
        for (p in obj) {
            this[p] = obj[p];
        }
        return this;
    }

    writeHash(v?) {
        location.hash = this.extend(v).toString();
        return this;
    }

    hash(obj?) {
        location.hash = this.extend(obj).toString();
        return this;
    }

    queryString(extend: {}): string
    queryString(): string
    queryString(obj?) {
        if (obj) obj = $extend($extend({}, obj), this);
        else obj = this;
        return Search.toSearch(obj);
    }

    toString() {
        return Search.toSearch(this);
    }
}


export abstract class HashManager<T extends Search> {

    abstract factory: new() => T
    search: T
    protected handlers = []

    abstract onChange(): Promise<any>

    addHandler(handler: (search: T, context: this) => void) {
        this.handlers.push(handler);
        return this;
    }

    reset(queryString: {}): this
    reset(queryString: string): this
    reset(query) {
        if (typeof query !== 'string')
            query = Search.toSearch(query);
        location.hash = query;
        return this;
    }

    extend(queryString: {}): this
    extend(queryString: string): this
    extend(query) {
        if (typeof query === 'string')
            Search.toObject(query, this.search);
        else
            this.search.extend(query);

        location.hash = this.search.toString();
        return this;
    }


    private reset0(queryString: string) {
        this.search = new this.factory().reset(queryString);
        this.onChange().then(v => {
            this.handlers.forEach(handler => handler(this.search, this));
        })
        return this;
    }

    onHash() {
        window.addEventListener('hashchange', () => this.reset0(location.hash.slice(1)));
        this.reset0(location.hash.slice(1));
        return this;
    }
}


export namespace Search {

    import primitive = Access.__primitive;
    import datetime = Formats.__datetime;
    let r_n = /&/


    export function create() {
        return new Search().reset();
    }

    /*
     *  ?????? ????????? ??????.
     *  ????????? ????????? ?????? ????????? ???????????? ????????? ?????? true??? ??????.
     */
    export function equals(a: string, b: string) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        let an = a.split(r_n), bn = b.split(r_n), len = an.length;
        while (len-- > 0) if (bn.indexOf(an[len]) === -1) return false;

        return true;
    }


    // Object  ====>  querystring
    export function toSearch(obj: Object, prefix = '') {

        if (__isEmptyObject(obj)) return '';

        let array: string[] = [], value;

        for (let key in obj) {
            value = obj[key];
            if (key[0] === '_' || key[0] === '$' || value == null || typeof value === 'function' || !hasOwnProperty(obj, key)) continue;
            if (__isPlainObject(value)) {
                array.push(toSearch(value, prefix + key + '.'));
            }
            // ie??? encodeURIComponent??? ???????????? ajax ????????? ??????.
            else if (Array.isArray(value)) {
                array = array.concat(value.map(v => key + '=' + encodeURIComponent(v)));
            } else if (value instanceof Date) {
                array.push(key + '=' + datetime(value));
            } else
                array.push(prefix + key + '=' + encodeURIComponent(value));
        }

        return array.join("&");
    }

    let r_1 = /&/,
        r_2 = /=/;

    // querystring  ====>  Object
    export function toObject(query: string, dest?) {

        let obj = {};

        if (query[0] === '?') query = query.slice(1);
        if (!query) return dest ? dest : obj;

        query.split(r_1)
            .filter(a => a && a.indexOf('=') !== -1)
            .forEach(v => {
                let [key, _value] = v.split(r_2),
                    value = Access.__access(obj, key);

                // decoding
                _value = primitive(decodeURIComponent(_value));

                // key??? ?????? ?????? array???
                if (value != null) {
                    if (!Array.isArray(value)) value = [value];
                    value.push(_value);
                } else value = _value;

                Access.__access(obj, key, value, true);
            });

        if (dest)
            obj = $extend(dest, obj);

        return obj;
    }
}


export class URLManager {

    host = ''
    pathname = ''
    search = ''
    hash = ''

    private path: string[]

    constructor(public fullURL: string) {
        let exec = r_url.exec(fullURL);
        if (exec) {
            this.host = exec[1] || '';

            // ?????? /??? ????????????.
            this.pathname = (exec[2] || '').replace(/^\//, '');
            this.search = exec[3] || '';
            this.hash = exec[4] || '';
        }
    }

    paths() {
        return this.path || (this.path = this.pathname.split(/\//));
    }


    equals(fullURL: string)
    equals(manager: URLManager)
    equals(v) {

        if (v == null) return false;

        if (typeof v === 'string') v = new URLManager(v);

        if (v.fullURL === this.fullURL) return true;

        if (v.host !== this.host) return false;
        if (v.pathname !== this.pathname) return false;
        if (!Search.equals(v.search, this.search)) return false;
        if (v.hash !== this.hash) return false;

        return true;
    }

}

export namespace URLManager {

    export function create(url: string) {
        return new URLManager(url);
    }

    // /admin/:name?music=:audio, {name: '?????????', audio: '??????'}  ===>   /admin/??????????music=??????
    // ???????????? ?????????  ????????? ????????? ??????????????????.
    export function queryExp(str: string, obj: {}) {

        let [url, query] = str.split(/\?/),
            URL = url.split(/\//).reduce((r, v) => {

                if (v[0] === ':' && (v = v.slice(1))) {
                    let value = Access.__access(obj, v);
                    value != null && r.push(value);
                } else r.push(v);
                return r;

            }, []).join('/'),
            QUERY: string;

        // ?????? ???????????? ??????????
        if (query) {
            QUERY = query.split(/&/).reduce((r, v) => {

                let [prop, value] = v.split(/\=/);
                if (value[0] === ':' && (value = value.slice(1))) {
                    let u = Access.__access(obj, value);
                    u != null && r.push(prop + '=' + u);
                } else r.push(v);

                return r;

            }, []).join('&');
        }
        return QUERY ? URL + '?' + QUERY : URL;
    }
}

