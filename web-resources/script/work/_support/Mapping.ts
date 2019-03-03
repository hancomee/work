import {_forEach} from "../../../lib/core/_func/array";
import {Access} from "../../../lib/core/access";
import {DOM} from "../../../lib/core/dom";
import {_replaceHTML} from "../../../lib/core/_html/replaceHTML";
import {Formats} from "../../../lib/core/format";
import {AbstractUtilClass} from "./mapping/_AbstractUtilClass";
import access = Access.access;
import expValParse = Formats.expValParse;
import number = Formats.number;
import datetime = Formats.datetime;


function isAlikeArray(target) {
    if (target && typeof target.length === 'number') {
        return true;
    }
    return false;
}

let defaultDirective = (function () {

    let directive = {
        number(ele: HTMLElement, v) {
            ele.textContent = number(v);
        },
        datetime(ele: HTMLElement, v, p) {
            ele.textContent = datetime(v, p);
        },
        // 문자열을 통해 엘리먼트 체크
        exp(ele: HTMLElement, v, opt) {

        }
    }

    return () => Object.create(directive);

})();

function $$mapping(prefix: string, val: any) {
    return prefix ? prefix + '.' + val : val;
}

function render(ele: HTMLElement, mapping: string,
                data, $val, Mapping: Mapping) {


    if(ele.hasAttribute('data-ignore'))
        return;

    let $mapping = ele.getAttribute('data-mapping'),
        attrVal: string;

    if ($mapping != null) {
        $val = access(data, mapping = $mapping);
    }

    /*
     *
     */
    if ((attrVal = ele.getAttribute('data-directive')) != null) {

        let {directive} = Mapping,
            [name, filter, primitive] = expValParse(attrVal),
            v = access($val, name);


        if (v == null)
            ele.textContent = '';
        else if (filter != null)
            directive[filter] && directive[filter].call(Mapping, ele, v, primitive);
        else
            ele.textContent = v.toString();
    }


    /*
     *  element.clone(true)
     */
    if ((attrVal = ele.getAttribute('data-template')) != null) {

        let temple = Mapping.template[attrVal],
            fragment = document.createDocumentFragment();

        ele.textContent = '';

        // ① 배열인 경우
        if (isAlikeArray($val)) {
            _forEach($val, (v, p) => {
                let c = temple(v),
                    prop = $$mapping(mapping, p);

                render(c, prop, data, v, Mapping);
                c.setAttribute('data-mapping', prop);
                fragment.appendChild(c);
            });
        }
        // ② 단일 객체
        else {
            let c = temple(ele);
            render(c, mapping, data, $val, Mapping);
            c.setAttribute('data-mapping', mapping);
            fragment.appendChild(c);
        }
        ele.appendChild(fragment);
    }

    /*
     *  html 문자열
     */
    else if ((attrVal = ele.getAttribute('data-html')) != null) {
        let html = Mapping.html[attrVal],
            htmls = [], pos = 0;

        if (isAlikeArray($val)) {
            _forEach($val, (v, p) => htmls[pos++] = html(v));
        } else htmls[pos++] = html($val);

        ele.innerHTML = htmls.join('');
    }

    /*
     *  단순 clone
     */
    else if ((attrVal = ele.getAttribute('data-replace')) != null) {
        let
            /*
             *  !로 시작하면 맨처음에만 붙이고 그 다음엔 붙이지 않는다.
             */
            noRender = attrVal[0] === '!',
            clone = Mapping.template[noRender ? attrVal.slice(1) : attrVal]($val);

        render(clone, mapping, data, $val, Mapping);

        noRender || ele.setAttribute('data-ignore', 'true');

        ele.parentElement.replaceChild(clone, ele);
    }
    else {
        let i = 0, childs = ele.children, l = childs.length
        for (; i < l; i++) {
            if (childs[i].nodeType === 1)
                render(<HTMLElement>childs[i], mapping, data, $val, Mapping);
        }
    }

};

export class Mapping extends AbstractUtilClass<Mapping> {

    data
    html = {}
    directive: MappingDirectives = defaultDirective();
    template: MappingTemplates = {}

    setData(data) {
        this.data = data;
        return this;
    }

    addHTML(target: HTMLElement): this {
        let {html} = this;
        _forEach(target.querySelectorAll('[data-html]'), (e: HTMLElement) => {
            html[e.getAttribute('data-html')] = _replaceHTML(e.innerText);
        });
        return this;
    }

    addTemplate(target: HTMLElement): this
    addTemplate(obj: MappingTemplates): this
    addTemplate(name: string, templeate: MappingTemplate): this
    addTemplate(a, b?) {
        if (typeof a === 'string') this.template[a] = b;
        else if (a.nodeType === 1) this.addTemplate(Mapping.createTemplates(a));
        else {
            let {template} = this, p;
            for (p in a) template[p] = a[p];
        }
        return this;
    }

    addDirective(obj: MappingDirectives): this
    addDirective(name: string, directive: MappingDirective): this
    addDirective(a, b?) {
        if (typeof a === 'string') this.directive[a] = b;
        else {
            let {directive} = this, p;
            for (p in a) directive[p] = a[p];
        }
        return this;
    }

    readData(mapping: string) {
        return access(this.data, mapping);
    }


    createTemplate(name: string, data): HTMLElement {
        let element = this.template[name](data);
        this.$render(element, data);
        return element;
    }

    $render(ele: HTMLElement, data = this.data) {
        render(ele, null, this.data, data, this);
        return ele;
    }

    $follow(name: string) {
        _forEach(document.querySelectorAll('[data-follow]'), (e: HTMLElement) => {
            if (e.getAttribute('data-follow').indexOf(name) !== -1) {
                this.$render(e)
            }
        });
        return this;
    }

}

export namespace Mapping {

    import createHTML = DOM.createHTML;

    function createTemplate(obj, target: HTMLElement) {
        let name = target.getAttribute('data-template'),
            html = createHTML(target.innerText);
        obj[name] = () => html.cloneNode(true);
        return obj;
    }

    export function createTemplates(target: HTMLElement) {
        let $templates = {};
        if (target.hasAttribute('data-template'))
            return createTemplate($templates, target);
        _forEach(target.querySelectorAll('[data-template]'), (e: HTMLElement) => {
            createTemplate($templates, e);
        });
        return $templates;
    }

}