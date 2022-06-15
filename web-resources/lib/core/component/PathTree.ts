import {__toggleClass} from "../_dom/_toggleClass";

type PathMap = {
    name: string
    path: string
    child: PathMap
}

const
    __check = (map) => {
        for (let i in map) return true;
        return false;
    },
    __loop = (paths: string[], index: number, obj: PathMap, prefix: string) => {
        const key = paths[index];

        if (!obj[key]) {
            obj[key] = {
                name: key,
                path: prefix + paths.slice(0, index + 1).join('/'),
                child: null
            };
        }
        if (paths[index + 1] === '') {
            obj[key].child = {};
            return obj;
        }
        if (paths.length === index + 1) return obj;

        if (!obj[key].child)
            obj[key].child = {} as any;

        return __loop(paths, index + 1, obj[key].child, prefix);
    },
    ____pathHTML = (data) => {
        let {name, path, child} = data,
            className = child ? 'class="has-child" ' : '',
            html = ['<li ' + className + 'data-path="' + path + '"><strong>&gt;</strong><span data-path="' + path + '">' + name + '</span>'],
            pos = 1;

        if (__check(child)) {
            html[pos++] = '<ul>';
            for (let p in child) {
                html[pos++] = ____pathHTML(child[p]);
            }
            html[pos++] = '</ul>';
        }
        html[pos] = '</li>';
        return html.join('');
    };


function _createMap(paths: string[], prefix = ''): PathMap {
    let obj = <PathMap>{};
    if (prefix && prefix[prefix.length - 1] !== '/') prefix = prefix + '/';
    paths.forEach(v => __loop(v.split(/\/|\\/), 0, obj, prefix));
    return obj;
}


function _createHTML(paths: string[], prefix = ''): string {
    let pathMap = _createMap(paths, prefix);

    let html = ['<ul>'], pos = 1, p;
    for (p in pathMap) {
        html[pos++] = ____pathHTML(pathMap[p]);
    }
    html[pos++] = '</ul>';
    return html.join('');
}


type PATH_HANDLER = (path: string, target: HTMLElement, li: HTMLLIElement) => Promise<any>
type SELECT_HANDLER = (path: string, target: HTMLElement, li: HTMLLIElement) => any

export class PathTree {

    private pathHandler: PATH_HANDLER
    private selectHandler: SELECT_HANDLER

    constructor(public container: HTMLElement, data: string[]) {
        container.innerHTML = _createHTML(data);

        container.addEventListener('click', (e) => {
            let target = <HTMLElement>e.target,
                tagName = target.tagName,
                parent = target.parentElement as any;

            // 폴더 열기
            if (tagName === 'STRONG') {
                let path = target.parentElement.getAttribute('data-path');
                if (this.pathHandler) this.pathHandler(path, target, parent).then(v => {
                    __toggleClass(target.parentElement, ['active']);
                });
                else __toggleClass(target.parentElement, ['active']);
            }
            if (tagName === 'SPAN') {
                let path = target.getAttribute('data-path');
                this.selectHandler && this.selectHandler(path, target, parent);
                this.current(path);
            }
        });
    }

    setPathHandler(handler: PATH_HANDLER) {
        this.pathHandler = handler;
        return this;
    }

    setSelectHandler(handler: SELECT_HANDLER) {
        this.selectHandler = handler;
        return this;
    }


    current(path: string) {
        let {container} = this, paths = path.split(/\//);
        Array.prototype.forEach.call(container.getElementsByTagName('li'), (li) => {
            let val = li.getAttribute('data-path');
            if (val.split(/\//).every((v, i) => v === paths[i]))
                __toggleClass(li, ['current', 'active'], true);
            else __toggleClass(li, ['current'], false);
        });
    }
}


export namespace PathTree {
    export const
        createMap = _createMap,
        createHTML = _createHTML;
}


/*
function ___loop(array, i, l, obj) {
    if (i < l) {
        obj[array[i]] = obj[array[i]] || {};
        ___loop(array, i + 1, l, obj[array[i]]);
    }
}

export function __pathMap(values: string[]) {
    let obj = {};
    values.forEach(v => {
        let array = v.split('/'), l = array.length;
        ___loop(values, 0, l, obj);
    });
    return obj;
}
*/
