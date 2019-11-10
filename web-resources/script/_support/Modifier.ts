import {Events} from "../../lib/core/events";
import {Forms} from "../../lib/core/support/Forms";
import {getElementsByAttr, querySelector} from "../../lib/core/_dom/selector";
import {DOM} from "../../lib/core/_dom/DOM";
import dataEvent = Events.dataEvent;
import createHTML = DOM.createHTML;
import {mapperDispatcher} from "./dispatcher";
import {AbstractUtilClass} from "./_AbstractUtilClass";

export interface ModifierEventObject extends iMapperObject {
    event: MouseEvent
    type: string                // data-template 값
    target: HTMLElement         // data-template-index 를 가진 엘리먼트
    templateSelector: string    // data-template-target 값   append/prepend 시 사용
}

type RemoveConfirmHandler = (e: ModifierEventObject, handler: (flag: boolean) => void) => void

/*
 *  ※권장
 *    own 객체는 상위 부모 레퍼런스를 가지고 있는게 좋다.
 *    그래야 보다 다각적으로 데이터를 수정할 수 있다.
 */
export interface ModifierConfig {
    update(data, formValues): Promise<any>

    // 단일 객체를 수정하는 경우 remove와 save를 필요없다.
    remove?(data): Promise<any>

    save?(formValues): Promise<any>

}


function __dispatcher(ele, data: any) {

    if (ele.hasAttribute('data-modifier-target')) {
        data.target = ele;
        data.type = ele.getAttribute('data-modifier-target');
        data.templateSelector = ele.getAttribute('data-template-target');
    }
}


function __mapping(mapping: string) {
    if (!mapping) return '';

    let i = mapping.lastIndexOf('.');
    if (i == -1) return '';
    return mapping.substring(0, i + 1);
}

function _removeConfirm(obj, handler) {
    handler(true);
}

/*
 *
 *   정말 많은 고민을 했다.
 *   [data-mapper]가 하나의 작업 그룹이 된다.
 *   [data-mapper]는 하나의 [data-template]만을 가질 수 있다.
 *   [data-mapper]
 *
 *
 */
export class Modifier extends AbstractUtilClass<Modifier> {

    private forms: { [index: string]: Forms } = {};
    private config: { [index: string]: ModifierConfig } = {};

    private removeConfirm: RemoveConfirmHandler = _removeConfirm

    constructor(public element: HTMLElement, private $mapping: iMapping) {
        super();
        dataEvent(this.element, 'click', 'data-modifier',
            (e) => ({event: e, eventTarget: e.target}),
            mapperDispatcher(__dispatcher), <any>this);

        Modifier.setCreators(element, this);
    }

    // 삭제 확인창을 띄위기 위한 용도
    setRemoveConfirmHandler(handler: RemoveConfirmHandler) {
        this.removeConfirm = handler;
        return this;
    }

    private getData(mapping: string) {
        return this.$mapping.readData(mapping);
    }


    addEventHandler(obj: { [index: string]: (this: Modifier, obj: ModifierEventObject) => void }) {
        for (let p in obj) {
            this[p] = obj[p];
        }
        return this;
    }

    addForm(key: string, forms: Forms) {
        this.forms[key] = forms;
        return this;
    }

    addForms(obj: { [index: string]: { createForms: Forms, curd: ModifierConfig } }): this
    addForms(template: HTMLElement, obj: { [index: string]: { createForms: (ele: HTMLElement) => Forms, curd: ModifierConfig } }): this
    addForms(key: string, forms: Forms, curd: ModifierConfig): this
    addForms(key, f?, curd?) {
        let {forms, config} = this;
        if (curd) {
            forms[key] = f;
            config[key] = curd;
            f.element.setAttribute('data-modifier-target', key);
        }
        else if (f) {
            getElementsByAttr(key, 'data-form', (_, e, v) => {
                if (f[v]) {
                    let form = f[v].createForms(createHTML(e.innerText));
                    form.element.setAttribute('data-modifier-target', v);
                    forms[v] = form;
                    config[v] = f[v].curd;
                }
            })
        } else {
            for (let p in key) {
                key[p].forms.element.setAttribute('data-modifier-target', p)
                forms[p] = key[p].forms;
                forms[p] = key[p].curd;
            }
        }

        return this;
    }

    // 인덱스 갱신
    refresh(container: HTMLElement, mapping: string) {

        mapping = __mapping(mapping);

        let {children} = container, c, l = children.length, i = 0, idx = 0;
        for (; i < l; i++) {
            if ((c = children[i]).nodeType === 1)
                c.setAttribute('data-mapping', mapping + idx++);
        }
        return this;
    }


    // ******************** dataEvent Directive Method ******************** //

    // unshift()
    private prepend({type, mapper, templateSelector}: ModifierEventObject) {
        let target = mapper.querySelector(templateSelector),
            {element} = this.forms[type].reset();

        element.classList.remove('modifier-form');
        element.removeAttribute('data-mapping');
        element.setAttribute('data-modifier-pos', '-1');

        target.insertBefore(element, target.firstChild);
        return this;
    }

    // push()
    private append({type, mapper, templateSelector}: ModifierEventObject) {
        let target = mapper.querySelector(templateSelector),
            {element} = this.forms[type].reset();

        element.classList.remove('modifier-form');
        element.removeAttribute('data-mapping');
        element.setAttribute('data-modifier-pos', '-2');

        target.appendChild(element);
        return this;
    }

    private modify({target, type, mapping}: ModifierEventObject) {
        let {element} = this.forms[type].reset(this.getData(mapping));

        element.classList.add('modifier-form');
        element.setAttribute('data-mapping', mapping);

        target.parentElement.insertBefore(element, target);
        return this;
    }


    private cancel({type}: ModifierEventObject) {
        this.forms[type].detach();
        return this;
    }


    private confirm({target, type, mapping}: ModifierEventObject) {
        let
            {$mapping} = this,
            forms = this.forms[type],
            config = this.config[type],
            {parentElement, nextElementSibling} = target;

        if (target.hasAttribute('data-mapping')) {
            config.update(forms.values(), this.getData(mapping))
                .then((value) => {
                    $mapping.$render(<HTMLElement>nextElementSibling);
                    forms.detach();
                });
        }

        else {
            this.$create(type, forms, parentElement, mapping,
                parseInt(target.getAttribute('data-modifier-pos')));
        }

    }

    private remove(obj: ModifierEventObject) {
        this.removeConfirm(obj, (flag) => flag && this.$remove(obj));
    }

    // list객체만 해당된다.
    private $remove({target, type, mapping}: ModifierEventObject) {

        let {parentElement} = target;
        this.config[type].remove(this.getData(mapping))
            .then(() => {
                parentElement.removeChild(target);
                this.refresh(parentElement, mapping);
            })
    }


    // 직접 추가할때도 쓴다.
    $create(type: string, forms: Forms, parentElement: HTMLElement, mapping: string, pos: number) {

        let config = this.config[type];

        config.save(forms.values())
            .then((value) => {
                let newElement = this.$mapping.createTemplate(type, value);

                // -1 : 맨 앞에 붙인다.
                // -2 : 맨 뒤에 붙인다.
                if (pos === -1) parentElement.insertBefore(newElement, parentElement.firstChild);
                else parentElement.appendChild(newElement);

                forms.detach();
                this.refresh(parentElement, mapping);
            });

    }
}


export namespace Modifier {

    export function setCreators(container: HTMLElement, modifier) {
        getElementsByAttr(container, 'data-modifier-creator', (r, e) => {
            setCreator(e, modifier);
        });
    }

    // 항상 노출되어 있는 등록폼
    export function setCreator(ele: HTMLElement, modifier: Modifier) {
        let
            {classList} = ele,
            type = ele.getAttribute('data-modifier-target'),
            mapping = ele.getAttribute('data-mapping') || '',
            pos = parseInt(ele.getAttribute('data-modifier-pos')) || -1,
            target = querySelector(modifier.element, ele.getAttribute('data-template-target')),
            btn = querySelector(ele, '[data-modifier="create"'),
            forms = new Forms(ele),
            validHandler = () => {
                if (forms.valid()) classList.remove('form-error');
                else classList.add('form-error');
            };

        forms.detach = () => {
            forms.reset();
            validHandler();
            return forms.element;
        }

        if (target == null)
            throw new Error('data-template-target="{selector}" 은 반드시 존재해야 합니다')

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            classList.contains('form-error') || modifier.$create(type, forms, target, mapping, pos);
        });

        ele.addEventListener('keyup', validHandler);
        ele.addEventListener('change', validHandler);
        validHandler();

    }

}