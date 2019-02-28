import {Events} from "../../../lib/core/events";
import dataEvent = Events.dataEvent;
import {Forms} from "../../../lib/core/form/Forms";
import {Access} from "../../../lib/core/access";
import access = Access.access;

interface EventObject {
    target: HTMLElement
    mapping: string
}

/*
 *  ※권장
 *    own 객체는 상위 부모 레퍼런스를 가지고 있는게 좋다.
 *    그래야 보다 다각적으로 데이터를 수정할 수 있다.
 */
export interface ModifierConfig {
    update(data, own, target: HTMLElement, element: HTMLElement)

    remove(own, target: HTMLElement, element: HTMLElement)

    save(data, target: HTMLElement, element: HTMLElement)

}

/*
 *  단순히 click 이벤트에 따라 forms를 해당 타켓에 붙여주는 역할만한다.
 */
export class Modifier {

    private data
    private forms: Forms;
    private classList: DOMTokenList

    constructor(public element: HTMLElement, private config: ModifierConfig) {
        dataEvent(element, 'click', 'data-modifier',
            () => (<EventObject>{}),
            (ele, data: EventObject, attrValue) => {

                let v: string;
                if ((v = ele.getAttribute('data-mapping')) != null) {
                    data.mapping = v;
                    data.target = ele;
                    return false;
                }
            }, <any>this);
        this.classList = element.classList;
    }

    setData(data) {
        this.data = data;
        return this;
    }

    setForm(forms: Forms) {
        this.forms = forms;
        return this;
    }

    // 인덱스 갱신
    refresh() {
        let {element: {children}, forms: {element}} = this, c,
            l = children.length, i = 0, idx = 0;
        for (; i < l; i++) {
            if((c = children[i]).nodeType === 1 && element !== c)
                c.setAttribute('data-index', idx++);
        }
        return this;
    }


    create(top = true) {

        let {element, classList} = this, {element: form} = this.forms.reset();
        form.removeAttribute('data-modify');

        if (top) element.insertBefore(element.firstChild, form);
        else element.appendChild(form);
        return this;
    }

    // ******************** dataEvent Directive Method ******************** //
    modify({target, mapping}: EventObject) {
        let {element} = this.forms.reset(access(this.data, mapping));
        element.setAttribute('data-modify', 'true');
        target.parentElement.insertBefore(element, target);
        return this;
    }

    cancel() {
        this.forms.detach();
        return this;
    }

    confirm({target, mapping}: EventObject) {
        let {forms, forms: {element}} = this;

        if (element.hasAttribute('data-modify'))
            this.config.update(forms.values(), access(this.data, mapping), target, this.element);
        else
            this.config.save(forms.values(), target, this.element);

    }

    remove({target, mapping}: EventObject) {
        this.config.remove(access(this.data, mapping), target, this.element);
    }

}