import {_forEach, _makeArray} from "../../../lib/core/_func/array";
import {Access} from "../../../lib/core/access";
import access = Access.access;

function $each(obj, handler: (v: any, key: any) => void) {
    if (Array.isArray(obj)) {
        for (let i = 0, l = obj.length; i < l; i++)
            handler.call(obj, obj[i], i);
    } else {
        for (let p in obj)
            handler.call(obj, obj[p], p);
    }
}

function $$mapping(prefix: string, val: string) {
    return prefix ? prefix + '.' + val : val;
}

function render(ele: HTMLElement, mapping: string,
                data, $val,
                directive: MappingDirective, template: MappingTemplate) {

    let
        i = 0, childs = _makeArray(ele.children), l = childs.length,
        $mapping = ele.getAttribute('data-mapping'),
        attrVal: string;

    if($mapping != null) {
        $val = access(data, mapping = $mapping);
    }

    /*
     *
     */
    if (attrVal = ele.getAttribute('data-val')) {
        let [name, filter] = attrVal.split(' | '),
            v = access($val, name);
        if (v == null)
            ele.textContent = '';
        else if (directive[filter])
            directive[filter].call(template, ele, v);
        else
            ele.textContent = v.toString();
    }

    /*
     *  리스트의 경우
     */
    else if ((attrVal = ele.getAttribute('data-each')) != null) {

        let temple = template[attrVal],
            fragment = document.createDocumentFragment();

        ele.textContent = '';

        $each($val, (v, p) => {

            let c = temple(ele, v),
                prop = $$mapping(mapping, p);

            render(c, prop, data, v, directive, template);
            c.setAttribute('data-mapping', prop);
            fragment.appendChild(c);
        });
        ele.appendChild(fragment);
    }

    /*
     *
     */
    for (; i < l; i++) {
        if (childs[i].nodeType === 1)
            render(<HTMLElement>childs[i], mapping, data, $val, directive, template);
    }
};

export class Mapping {

    constructor(public data, public directive: MappingDirective, public template: MappingTemplate) {
    }

    $render(ele: HTMLElement) {
        render(ele, null, this.data, this.data, this.directive, this.template);
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

    export function $render(ele: HTMLElement, data, directive: MappingDirective, template: MappingTemplate) {
        render(ele, null, data, data, directive, template);
    }

}