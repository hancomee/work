import {_forEach, _makeArray} from "../../../lib/core/_func/array";
import {Access} from "../../../lib/core/access";
import {DOM} from "../../../lib/core/dom";
import access = Access.access;
import {_replaceHTML} from "../../../lib/core/_html/replaceHTML";
import {Formats} from "../../../lib/core/format";
import expValParse = Formats.expValParse;
import number = Formats.number;
import datetime = Formats.datetime;

type MappingDirectives = { [index: string]: MappingDirective };
type MappingTemplates = { [index: string]: MappingTemplate };

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
        }
    }

    return () => Object.create(directive);

})();

function $$mapping(prefix: string, val: any) {
    return prefix ? prefix + '.' + val : val;
}

function render(ele: HTMLElement, mapping: string,
                data, $val, Mapping) {

    let
        i = 0, childs = _makeArray(ele.children), l = childs.length,
        $mapping = ele.getAttribute('data-mapping'),
        attrVal: string;

    if ($mapping != null) {
        $val = access(data, mapping = $mapping);
    }

    /*
     *
     */
    if (attrVal = ele.getAttribute('data-directive')) {
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
    else if ((attrVal = ele.getAttribute('data-template')) != null) {

        let temple = Mapping.template[attrVal],
            fragment = document.createDocumentFragment();

        ele.textContent = '';

        // ① 배열인 경우
        if (isAlikeArray($val)) {
            _forEach($val, (v, p) => {
                let c = temple(ele, v),
                    prop = $$mapping(mapping, p);

                render(c, prop, data, v, Mapping);
                c.setAttribute('data-mapping', prop);
                fragment.appendChild(c);
            });
        }
        // ② 단일 객체
        else {
            let c = temple(ele, $val);
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

        if (Array.isArray($val)) {
            _forEach($val, (v, p) => htmls[pos++] = html(v));
        } else htmls[pos++] = html($val);

        ele.innerHTML = htmls.join('');
    }

    /*
     *
     */
    for (; i < l; i++) {
        if (childs[i].nodeType === 1)
            render(<HTMLElement>childs[i], mapping, data, $val, Mapping);
    }
};

export class Mapping {

    data
    html = {}
    directive: MappingDirectives = defaultDirective();
    template: MappingTemplates = {}

    setData(data) {
        this.data = data;
        return this;
    }

    addHTML(target: HTMLElement): Mapping {
        let {html} = this;
        _forEach(target.querySelectorAll('[data-html]'), (e: HTMLElement) => {
            html[e.getAttribute('data-html')] = _replaceHTML(e.innerText);
        });
        return this;
    }

    addTemplate(target: HTMLElement): Mapping
    addTemplate(obj: MappingTemplates): Mapping
    addTemplate(name: string, templeate: MappingTemplate): Mapping
    addTemplate(a, b?) {
        if (typeof a === 'string') this.template[a] = b;
        else if (a.nodeType === 1) this.addTemplate(Mapping.createTemplates(a));
        else {
            let {template} = this, p;
            for (p in a) template[p] = a[p];
        }
        return this;
    }

    addDirective(obj: MappingDirectives): Mapping
    addDirective(name: string, directive: MappingDirective): Mapping
    addDirective(a, b?) {
        if (typeof a === 'string') this.directive[a] = b;
        else {
            let {directive} = this, p;
            for (p in a) directive[p] = a[p];
        }
        return this;
    }

    $render(ele: HTMLElement, data = this.data) {
        render(ele, null, data, data, this);
        return this;
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

/*
 *    ① 이 루프는 데이터 구조를 모두 알고 있다는 전제하에 쓰여진다.
 *
 */
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