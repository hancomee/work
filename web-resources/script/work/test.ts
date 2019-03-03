import {Events} from "../../lib/core/events";
import {Formats} from "../../lib/core/format";
import {_replaceHTML} from "../../lib/core/_html/replaceHTML";
import {Work} from "./_core/Work";
import {_forEach, _makeArray, _range} from "../../lib/core/_func/array";
import acceptKeys = Events.acceptKeys;
import {Mapping} from "./_support/Mapping";
import {__makeArray} from "../../lib/core/core";
import {DOM} from "../../lib/core/dom";
import createHTML = DOM.createHTML;
import map = Events.map;
import {getElementById, getElementChilds, getElementsByTagName} from "../../lib/core/_dom/selector";
import {HTML} from "../../lib/core/html";
import compile = HTML.compile;
import htmlParser = HTML.htmlParser;

function run(fns: any[], nums: number) {

    return fns.map(f => {
        var startTime = new Date().getTime(),
            i = 0;

        for (; i < nums; i++) {
            f();
        }

        var endTime = new Date().getTime();
        return endTime - startTime;
    })
}


function parsing(ele: HTMLElement, mapping: Mapping) {

    if (ele.nodeType !== 1) return;

    let childs = getElementChilds(ele),
        templateName = ele.getAttribute('data-template'),
        isTemplate = templateName != null;

    if (isTemplate && childs.length > 1)
        throw new Error('[data-template]는 반드시 하나의 엘리먼트만 자식으로 가질 수 있습니다.');

    _forEach(childs, (e: HTMLElement, i) => {
        parsing(e, mapping);
    })

    if (isTemplate) {
        let child = childs[0];
        ele.removeChild(child);
        mapping.addTemplate(templateName, () => <HTMLElement>child.cloneNode(true));
    }
}

