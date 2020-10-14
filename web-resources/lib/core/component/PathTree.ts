import {Arrays} from "../_array";
import _forEach = Arrays.__forEach;
import {_pathMap} from "../_util/_pathMap";
import {__createHTML} from "../_dom/_commons";

let
    ___$createHTML = (tree, html: string[] = [], index = {v: 0}) => {
        let p, hasChild = '';
        for (p in tree.childs) {
            hasChild = ' class="has-childs"';
            break;
        }
        html[index.v++] = '<li' + hasChild + ' data-tree="' + tree.path + '">';
        html[index.v++] = '<i class="tree-toggle">'
        if (hasChild) html[index.v++] = '&gt;'
        html[index.v++] = '</i>'
        html[index.v++] = '<span data-href="' + tree.path + '">' + tree.name + '</span>'

        if (hasChild) {
            html[index.v++] = '<ul>';
            for (let p in tree.childs)
                ___$createHTML(tree.childs[p], html, index);
            html[index.v++] = '</ul>';
        }
        html[index.v++] = '</li>';

        return html;
    },
    __$createHTML = (tree, html: string[] = [], index = {v: 0}) => {
        html[index.v++] = '<ul class="tree">';
        for (let p in tree) {
            ___$createHTML(tree[p], html, index);
        }
        html[index.v++] = '</ul>'
        return html.join('');
    };


export class PathTree {

    element: HTMLElement
    trees: NodeListOf<HTMLElement>

    private _onClick

    constructor(paths: string[]) {
        this.element = __createHTML(__$createHTML(_pathMap(paths)), true);
        this.trees = this.element.querySelectorAll('[data-tree]');

        this.element.addEventListener('click', (e) => {
            let target = <HTMLElement>e.target;
            if (target.className === 'tree-toggle') {
                target.parentElement.classList.toggle('open');
            }
            else if (target.hasAttribute('data-href')) {
                this._onClick(target.getAttribute('data-href'), this);
            }
        });
    }

    on(handler: (path: string, context: this) => void) {
        this._onClick = handler;
        return this;
    }

    $element(handler: (ele: HTMLElement, context: this) => void) {
        handler(this.element, this);
        return this;
    }

    active(path: string) {
        if(!path) return this;
        let s;
        _forEach(this.trees, (e) => {
            s = e.getAttribute('data-tree');
            if (s === path) {
                e.classList.add('active');
            }
            else if (path.indexOf(s) === 0)
                e.classList.add('active', 'open');
            else e.classList.remove('active');
        });
        return this;
    }

    appendTo(ele: HTMLElement) {
        ele.appendChild(this.element);
        return this;
    }

}