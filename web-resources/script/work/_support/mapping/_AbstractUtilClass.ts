export class AbstractUtilClass<T> {


    $$preProcess(ele, directive: { [index: string]: (ele: HTMLElement, context: T, container: HTMLElement) => void }) {
        let list = ele.querySelectorAll('[data-pre-process]'), l = list.length, i = 0,
            u, e;
        for (; i < l; i++) {
            e = list[i];
            if ((u = directive[e.getAttribute('data-pre-process')])) {
                u.call(directive, e, this, ele);
            }
        }
        return this;
    }


}