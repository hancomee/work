import {r_number} from "../_regexp/number";
import {_remap} from "../_util/remap";
import {r_inputs} from "../_regexp/inputs";
import {Calendar} from "../calendar";
import {Access} from "../access";
import {__noop} from "../_func/_noop";
import {Formats} from "../format";
import date = Formats.date;
import datetime = Formats.datetime;
import toDate = Formats.toDate;
import {Events} from "../events";
import simpleTrigger = Events.simpleTrigger;

let

    {forEach} = Array.prototype,
    dummy = {},
    r_date = /\d{4}-\d{1,2}-\d{1,2}/,
    /*
     *  ① type.name
     *  ② type
     */

    DATA_CONVERT = (p: string, value) => {
        switch (p) {
            case 'boolean' :
                return value === 'true' ? true : false;
            case 'number' :
                return r_number.test(value) ? parseInt(value) : 0;
            case 'date' :
                if (!r_date.test(value)) return null;
                let [y, m, d] = value.split('-');
                return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
            default :
                return value;
        }
    },


    /*
     *
     *  <input> 엘리먼트에서 값을 읽으면서 형변환을 시켜준다.
     *
     *  input에서 null이 나올리 없으므로
     *  null 반환시 최종 결과객체에 제외된다.
     */
    DEFAULT_GETTER = _remap({

        file(input: HTMLInputElement) {
            if (input.value) {
                if (input.files) return input.files;
                else input.value;
            }
            return null;
        },
        'select-multiple'(select: HTMLSelectElement) {
            let i = 0, {length} = select, array = [];
            for (; i < length; i++) {
                if (select[i].checked) array.push(select[i]);
            }
            return array.length ? array : null;

        },
        date(date: HTMLInputElement) {
            let value = date.value.trim();
            if(!value && date.hasAttribute('data-default')) {
                value = date.getAttribute('data-default');
                if(value === 'now') return new Date();
            }
            return toDate(value);
        },
        datetime: 'date',
        select(select: HTMLSelectElement) {
            let {selectedIndex} = select;
            if (selectedIndex !== -1) return select[selectedIndex].value;
            return null;
        },
        'select-one': 'select',
        radio(input: HTMLInputElement) {
            if (input.checked) return input.value;
            return null;
        },
        checkbox(input: HTMLInputElement) {
            if (input.checked) {
                return input.hasAttribute('data-value') ?
                    input.getAttribute('data-value') :
                    input.value;
            } else {
                if (input.hasAttribute('data-null')) {
                    return DATA_CONVERT(input.getAttribute('data-type'), input.getAttribute('data-null'));
                }
            }
            return null;
        },
        number(input: HTMLInputElement) {

            let value = input.value;

            if (r_number.test(value))
                return parseInt(value);
            return 0;
        },
        text(input: HTMLInputElement) {
            return input.value;
        },
        hidden(input: HTMLInputElement) {
            let {value} = input;
            if (input.hasAttribute('identity') && !value) return null;
            return DATA_CONVERT(input.getAttribute('data-type'), value);
        },
        textarea(input: HTMLTextAreaElement) {
            return input.value;
        }

    }),

    // <input>값을 셋팅한다.
    DEFAULT_SETTER = _remap({

        number(input: HTMLInputElement, val) {
            if (typeof val === "number") val = val.toString();
            else if (val == null || !r_number.test(val))
                val = '0';
            input.value = val;
        },
        // null값이 들어올 수 있다.
        date(input: HTMLInputElement, val) {
            if (val == null) input.value = '';
            else {
                if (val instanceof Date)
                    input.value = date(val);
                else input.value = val;
            }
        },
        datetime(input: HTMLInputElement, val) {
            if (val == null) input.value = '';
            else {
                if (val instanceof Date)
                    input.value = datetime(val);
                else input.value = val;
            }
        },
        radio(input: HTMLInputElement, val) {
            if (val == null)
                input.checked = input.hasAttribute('checked');
            else {
                let value = input.getAttribute('value');
                if (Array.isArray(val))
                    input.checked = val.indexOf(value) !== -1;
                else input.checked = value == val;
            }
        },
        checkbox: 'radio',
        text(input: HTMLInputElement, value) {

            switch (input.getAttribute('data-type')) {
                case 'date' :
                    if (value instanceof Date)
                        return input.value = Calendar.isodate(value);
                default :
                    input.value = value || '';
            }
        }
    });


export type FormHandler = {
    [key: string]: {
        // 직접 인풋에 값을 대입한다.
        set(input: INPUTS[], v): void

        // 값을 읽어서 내보내준다.
        get(inputs: INPUTS[]): any
    }
}

type ValidHandler = (forms: Forms, element: HTMLElement, valid: boolean) => void

// 같은 값이 있을때만 배열로
function $serialize(input: INPUTS, obj, name = input.name) {
    let type = input.getAttribute('data-type') || input.type, v, vv;

    if (DEFAULT_GETTER[type]) {
        v = DEFAULT_GETTER[type](input)
        if (v !== null) {
            if (vv = obj[name]) {
                if (!Array.isArray(vv)) obj[name] = vv = [vv];
                vv.push(v);
            } else obj[name] = v;
        }
    } else {
        obj[name] = input.value;
    }
}

// ************************ ▼ Forms Constructor ▼ ************************ //
function formEach(target: Element, form: Forms) {
    if (target.nodeType === 1) {
        if (target.classList.contains('form-group'))
            groupEach(target, form.createGroups(<any>target));
        else if (target.hasAttribute('name')) {
            form.put(target);
        } else {
            let {children, children: {length}} = target;
            while (length-- > 0) {
                formEach(children[length], form);
            }
        }
    }
    return form;
}

function groupEach(target: Element, formGroup: FormGroups) {
    if (target.nodeType === 1) {

        let {children, children: {length}} = target, i = 0;
        for (; i < length; i++) {
            target = children[i];
            if (target.hasAttribute('name') && r_inputs.test(target.tagName)) {
                formGroup.add(<any>target);
            } else groupEach(target, formGroup);
        }
    }
}

// ************************ ▲ Forms Constructor ▲ ************************ //

export class Forms {

    /*
     *  [form-group]에 속하지 않는 <input>의 경우 여기에 속하게 된다.
     *  own 역시 groups 배열에 들어간다.
     */

    private own: FormGroups
    groups: FormGroups[] = []

    private defaultHandler: FormHandler = dummy
    validHandler: ValidHandler = __noop

    constructor(public element: HTMLElement) {
        formEach(element, this);
    }

    $element(handler: (element: HTMLElement, forms: this) => void) {
        handler(this.element, this);
        return this;
    }

    setHandlers(handlers: FormHandler) {
        this.defaultHandler = handlers;
        return this;
    }

    createGroups(target: HTMLElement) {
        let g = new FormGroups(target);
        this.groups.push(g);
        return g;
    }

    put(input) {
        let {own} = this;
        if (!own) own = this.own = this.createGroups(this.element)
        own.add(input);
        return this;
    }

    values(handlers = this.defaultHandler) {
        let result = {};
        this.each((p, inputs) => {
            if (handlers[p]) result[p] = handlers[p].get(inputs);
            else inputs.forEach(input => $serialize(input, result, p));
        });
        return result;
    }

    reset(obj = dummy, handlers = this.defaultHandler) {
        let v;
        this.each((p, inputs) => {
            v = obj[p];
            if (handlers[p]) handlers[p].set(inputs, v);
            else inputs.forEach(input => {
                Forms.set(input, v);
            });
        });
        simpleTrigger(this.element, 'reset', false, false);
        return this;
    }

    each<T>(handler: (p: string, inputs: INPUTS[], t: T) => T, obj?: T): T {
        let p, inputs;

        this.groups.forEach(g => {
            inputs = g.inputs;
            for (p in inputs)
                obj = handler(p, inputs[p], obj);
        });

        return obj;
    }

    valid(handler?: VALID_HANDLER) {
        let valid = Forms.$valid(this, handler);
        this.validHandler(this, this.element, valid);
        return valid;
    }

    detach() {
        let {element} = this,
            parent = element.parentElement;
        if (parent) parent.removeChild(element);
        return element;
    }

    prepend(ele: HTMLElement) {
        ele.parentElement.insertBefore(this.element, ele);
        return this;
    }

}


export class FormGroups {
    inputs: { [index: string]: INPUTS[] } = {}

    constructor(public element: HTMLElement) {
    }

    add(input: INPUTS) {
        let {inputs} = this, {name} = input;
        if (name) {
            (inputs[name] || (inputs[name] = [])).push(input);
        }
        return this;
    }
}

export namespace Forms {

    import access = Access.access;

    let
        /*
         *  ① attr.type.name
         *  ② attr.type
         *  ③ attr
         */
        input_valid: INPUT_MAP = _remap({

            // 두번째 인자값은 해당 어트리뷰트의 값
            required(target, v: string) {
                if(v === 'false') return true;
                return !!target.value;
            },

            'required.select-multiple'(target: HTMLSelectElement, v: string) {

                let {length} = target;
                while (length-- > 0)
                    if (target[length].selected) return true;
                return false;
            },
            'required.select': 'required.select-multiple',
            'required.select-one': 'required.select-multiple',

            'pattern.text'(target: HTMLInputElement, v: string) {
                try {
                    return new RegExp(v).test(target.value);
                } catch (e) {
                    return true;
                }
            },

            'maxlength.text'(target: HTMLInputElement, v: string) {
                if (!r_number.test(v)) return true;
                return !(target.value.length > parseInt(v));
            },
            'maxlength.textarea': 'maxlength.text',

            'minlength.text'(target: HTMLInputElement, v: string) {
                if (!r_number.test(v)) return true;
                return !(target.value.length < parseInt(v));
            },
            'minlength.textarea': 'minlength.text',


            'max.select'(target: HTMLSelectElement, v: string) {
                if (!r_number.test(v)) return true;
                let max = parseInt(v), {length} = target, selected = 0;
                while (length-- > 0)
                    target[length].selected && selected++;

                return !(max < selected);
            },
            'max.select-multiple': 'max.select',
            'max.select-one': 'max.select',
            'min.select'(target: HTMLSelectElement, v: string) {
                if (!r_number.test(v)) return true;
                let min = parseInt(v), {length} = target;
                while (length-- > 0)
                    if (target[length].selected && --min === 0) return true;
                return false;
            },
            'min.select-multiple': 'min.select',
            'min.select-one': 'min.select',

            'min.number'(target: HTMLInputElement, v: string) {

            }
        }),

        group_valid: GROUP_MAP = _remap({
            min(ele: HTMLElement, val: string) {
            },
            max(ele: HTMLElement, val: string) {

            }
        }),

        error_msg = {
            required: '반드시 필요한 항목입니다.'
        };


    let skipProps = 'name type'.split(' ');


    // 각 key를 조합해 검증 핸들러를 찾는다.

    function getValid(attrName: string, type, name) {
        return input_valid[attrName + '.' + type + '.' + name] ||
            input_valid[attrName + '.' + type] ||
            input_valid[attrName];
    }

    function _group(group: HTMLElement, attrName: string, attrValue: string): boolean {
        let fn = group_valid[attrName];
        return fn ? fn(group, attrValue) : true;
    }

    function _message(attrName: string, attrValue: string, type: string, name: string) {
        let msg = error_msg[attrName + '.' + type + '.' + name] ||
            error_msg[attrName + '.' + type] ||
            error_msg[attrName];
        if (msg) return msg.replace(/%/g, attrValue);
        return attrName + ' is wrong.' + '(:' + attrValue + ')';
    }

    export function $valid(target: HTMLElement, h?: VALID_HANDLER)
    export function $valid(forms: Forms, h?: VALID_HANDLER)
    export function $valid(t, handler: VALID_HANDLER = __noop) {
        let form: Forms = t instanceof Forms ? t : Forms.createForms(t),
            {element} = form,
            result = true, valid: boolean,
            fn;

        form.groups.forEach(group => {
            let name, {inputs, element: e} = group;
            for (name in inputs) {
                inputs[name].forEach(input => {
                    let {type, attributes, attributes: {length: l}} = input, attr: Attr;

                    while (l-- > 0) {
                        attr = attributes[l];
                        if (fn = getValid(attr.name, type, name)) {
                            result = (valid = fn(input, attr.value)) ? result : false;
                            handler(valid, input, e, element);
                        }
                    }
                })
            }
        });

        return result;
    }

    export function input(i: INPUTS) {
        let {type, name, attributes, attributes: {length: l}} = i, fn;
        while (l-- > 0) {
            if (fn = getValid(attributes[l].name, type, name)) {
                if (!fn(i, attributes[l].value)) return false;
            }
        }
        return true;
    }

    export function createForms(target: HTMLElement) {
        return new Forms(target);
    }

    export function reset(inputs: iEleArray, obj = dummy) {
        forEach.call(inputs, (v) => set(v, access(obj, v.name)))
    }

    export function set<T>(input: T, v: any): T {
        let f = DEFAULT_SETTER[input['getAttribute']('data-type') || input['type']];
        if (f) {
            f(input, v);
        } else {
            input['value'] = v == null ? '' : v;
        }

        return input;
    }


    export function serialize(form: ArrayLike<HTMLElement>)
    export function serialize(form: HTMLFormElement)
    export function serialize(form) {

        let {length} = form,
            input, name,
            obj = {};

        while (length-- > 0) {
            input = form[length];
            if (!input.disabled && (name = input.name)) {
                $serialize(input, obj, name);
            }
        }

        return obj;
    }
}