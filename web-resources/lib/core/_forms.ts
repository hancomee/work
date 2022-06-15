import {r_number} from "./_regexp/number";
import {__remap} from "./_util/_remap";
import {Calendar} from "./support/Calendar";
import {Access} from "./_access";
import {Events} from "./_events";
import {Formats} from "./_format";
import {__noop} from "./_snippet/_noop";
import {__findAll} from "./_dom/_selector";
import simpleTrigger = Events.__$simpleTrigger;
import toDate = Formats.__toDate;
import date = Formats.__date;
import datetime = Formats.__datetime;
import __primitive = Access.__primitive;
import {FormEvent} from "./_form/_formEvents";
import {__toggleClass} from "./_dom/_toggleClass";

type INPUT_MAP = { [index: string]: INPUTS[] }
type INPUTS = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type INPUT_VALID = (ele: INPUTS, val: string) => boolean;
type INPUT_VALID_MAP = { [index: string]: INPUT_VALID };
type ERROR_MAP = { [index: string]: string }
type VALID_HANDLER =
    (valid: boolean, input: INPUTS, form: HTMLElement,
     maps: { [index: string]: INPUTS[] }, index: number) => void


export type EACH_HANDLER<T> = (inputs: INPUTS[], name: string, INPUT_MAP, form: Forms, t: T) => void;
export type EACH_HANDLER_MAP<T> = { [index: string]: (inputs: INPUTS[], INPUT_MAP, form: Forms, t: T) => void };


let

    {forEach} = Array.prototype,
    dummy = {},
    r_date = /\d{4}-\d{1,2}-\d{1,2}/,
    /*
     *  ① type.name
     *  ② type
     */

    DATA_CONVERT = (p: string, value) => {
        if (value == null) return value;
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
    DEFAULT_GETTER = __remap({

        file(input: HTMLInputElement) {
            if (input.value) {
                if (input.files) return input.files;
                else input.value;
            }
            return null;
        },
        'select-multiple'(select: HTMLSelectElement) {
            let i = 0, {options, options: {length}} = select, array = [];
            for (; i < length; i++) {
                if (options[i].selected) array.push(select[i]);
            }
            return array.length ? array : null;

        },
        date(date: HTMLInputElement) {
            let value = date.value.trim();
            if (!value && date.hasAttribute('data-default')) {
                value = date.getAttribute('data-default');
                if (value === 'now') return new Date();
            }
            return toDate(value);
        },
        datetime: 'date',
        select(select: HTMLSelectElement) {
            let {selectedIndex} = select;
            if (selectedIndex !== -1) return select[selectedIndex]['value'];
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
            let value = input.value,
                p = value[0] === '-' ? -1 : 1
            return parseInt(value.replace(/[^\d]+/g, '') || '0') * p;
        },
        text(input: HTMLInputElement) {
            let {value} = input;
            if (!value.trim() && input.hasAttribute('data-empty')) {
                value = input.getAttribute('data-empty');
                if (value === 'null' || !value) value = null;
            }
            return DATA_CONVERT(input.getAttribute('data-type'), value);
        },
        hidden: 'text',
        textarea(input: HTMLTextAreaElement) {
            return input.value;
        }

    }),

    // <input>값을 셋팅한다.
    DEFAULT_SETTER = __remap({

        select(input: HTMLSelectElement, val) {
        },
        'select-one'(input: HTMLSelectElement, val) {
            let {selectedOptions: opt} = input,
                len = opt.length;

            while (len-- > 0) {
                opt[len].selected = opt[len].value == val;
            }
        },
        number(input: HTMLInputElement, val) {
            if (typeof val === "number") val = val.toString();
            else if (val == null || !r_number.test(val))
                val = '';
            input.value = val;
        },
        // null값이 들어올 수 있다.
        date(input: HTMLInputElement, val) {
            if (val == null) {
                val = '';
                if (input.hasAttribute('data-default')) {
                    val = input.getAttribute('data-default');
                    if (val === 'now') val = date(new Date());
                }
                input.value = val;
            } else {
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
                else input.checked = value === (val + '');
            }
        },
        checkbox: 'radio',
        text(input: HTMLInputElement, value) {

            switch (input.getAttribute('data-type')) {
                case 'date' :
                    if (value instanceof Date)
                        return input.value = Calendar.isodate(value);
                default :
                    input.value = value == null ? '' : value;
            }
        }
    }),
    __FORM_EVENT = {
        money: FormEvent.__$money,
        number: FormEvent.__$number,
        date: FormEvent.__$date
    };


export type INPUT_HANDLER = {
    // 직접 인풋에 값을 대입한다.
    set?(input: INPUTS[], v, forms: Forms): void

    // 값을 읽어서 직접 저장한다
    get?(inputs: INPUTS[], result: { [index: string]: any }, forms: Forms): void

    valid?(inputs: INPUTS[], forms: Forms): boolean
}
export type INPUT_HANDLER_MAP = { [index: string]: INPUT_HANDLER }

type ValidHandler = (forms: Forms, element: HTMLElement, valid: boolean) => void

// 같은 값이 있을때만 배열로
function $serialize(input: INPUTS, obj, name = input.name) {
    let type = input.getAttribute('data-type') || input.type,
        v, vv;

    if (DEFAULT_GETTER[type]) {
        v = DEFAULT_GETTER[type](input);
        if (v !== null) {
            if (vv = obj[name]) {
                if (!Array.isArray(vv)) obj[name] = vv = [vv];
                vv.push(v);
            } else obj[name] = v;
        }
    } else {
        obj[name] = __primitive(input.value);
    }
}


export class Forms {

    /*
     *  [form-group]에 속하지 않는 <input>의 경우 여기에 속하게 된다.
     *  own 역시 groups 배열에 들어간다.
     */

    inputs: INPUT_MAP = {}

    private inputHandlers: INPUT_HANDLER = {}

    // valid() 후에 불려질 일종의 이벤트 핸들러
    private validHandler: ValidHandler = __noop
    private ignore_empty = true    // 빈 문자열 최종 객체에서 제외할지

    constructor(public element: HTMLElement, public validClass = ['is-invalid', 'is-valid']) {
        __findAll(element, '[name]').forEach(ele => {
            this.add(ele as any);
        });
    }

    toggleClass(input: INPUTS, flag: boolean) {
        __toggleClass(input, this.validClass, flag);
        return this;
    }

    $element(handler: (element: HTMLElement, forms: this) => void) {
        handler(this.element, this);
        return this;
    }

    ignoreEmpty(flag = !this.ignore_empty) {
        this.ignore_empty = flag;
        return this;
    }

    setHandlers(names: string[], handler: INPUT_HANDLER): this
    setHandlers(handlers: INPUT_HANDLER_MAP): this
    setHandlers(arg, arg2?) {
        if (arg2) {
            let {inputHandlers} = this;
            arg.forEach(n => inputHandlers[n] = arg2);
        } else this.inputHandlers = arg;
        return this;
    }

    add(input: INPUTS) {
        let {inputs} = this, {name} = input;
        if (name) {
            let e: any = input.getAttribute('form-event');
            if (e = __FORM_EVENT[e]) e(input);
            (inputs[name] || (inputs[name] = [])).push(input);
        }
        return this;
    }

    values(handlers = this.inputHandlers): any {
        let {ignore_empty} = this, result = {};
        this.each((inputs, p) => {
            if (handlers[p] && handlers[p].get) handlers[p].get(inputs, result, this);
            else inputs.forEach(input => {
                if (!ignore_empty || input.type !== 'text' || input.value.trim())
                    $serialize(input, result, p);
            });
        });
        return result;
    }

    reset(obj = dummy, handlers = this.inputHandlers) {
        let v;
        this.each((inputs, p) => {
            v = obj[p];
            if (handlers[p] && handlers[p].set) handlers[p].set(inputs, v, this);
            else inputs.forEach(input => Forms.set(input, v));
        });
        simpleTrigger(this.element, 'reset', false, false);
        return this;
    }

    //
    each<T>(directive: EACH_HANDLER_MAP<T>, obj?: T): this
    each<T>(handler: EACH_HANDLER<T>, obj?: T): this
    each(handler, obj?) {
        if (typeof handler === 'function') {
            let p, {inputs} = this;
            for (p in inputs)
                handler(inputs[p], p, inputs, this, obj);
        } else {
            let p, {inputs} = this;
            for (p in handler) {
                if (inputs[p])
                    handler[p](inputs[p], inputs, this, obj);
            }
        }
        return this;
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

    prepend(ele: Element) {
        ele.parentElement.insertBefore(this.element, ele);
        return this;
    }
}

export namespace Forms {

    import access = Access.__access;

    let
        /*
         *  ① attr.type.name
         *  ② attr.type
         *  ③ attr
         */
        input_valid: INPUT_MAP = __remap({

            // 두번째 인자값은 해당 어트리뷰트의 값
            required(target, v: string) {
                if (v === 'false') return true;
                return !!target.value;
            },

            'required.select-multiple'(target: HTMLSelectElement, v: string) {

                let {length} = target;
                while (length-- > 0)
                    if (target[length]['selected']) return true;
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
                    target[length]['selected'] && selected++;

                return !(max < selected);
            },
            'max.select-multiple': 'max.select',
            'max.select-one': 'max.select',
            'min.select'(target: HTMLSelectElement, v: string) {
                if (!r_number.test(v)) return true;
                let min = parseInt(v), {length} = target;
                while (length-- > 0)
                    if (target[length]['selected'] && --min === 0) return true;
                return false;
            },
            'min.select-multiple': 'min.select',
            'min.select-one': 'min.select',

            'min.number'(target: HTMLInputElement, v: string) {

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
            {inputs, element, inputHandlers, validClass} = form as any,
            result = true, valid: boolean,
            fn, name;

        for (name in inputs) {

            // 특정 그룹 핸들러 :: (Forms에 직접 등록한다.)
            if (inputHandlers[name] && inputHandlers[name].valid) {
                result = (valid = inputHandlers[name].valid(inputs[name], form)) ? result : false;
            } else {
                inputs[name].forEach((input, i) => {
                    let {type, attributes, attributes: {length: l}} = input, attr: Attr;
                    while (l-- > 0) {
                        attr = attributes[l];
                        if (!/data-|type|name/i.test(attr.name) && (fn = getValid(attr.name, type, name))) {
                            result = (valid = fn(input, attr.value)) ? result : false;

                            __toggleClass(input.classList, validClass, valid);

                            handler(valid, input, element, inputs, i);
                        }
                    }
                })
            }
        }
        __toggleClass(element.classList, validClass, valid);

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

    export function createForms(target: HTMLElement): Forms {
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