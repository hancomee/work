import {Forms} from "../../../lib/core/form/Forms";
import {DOM} from "../../../lib/core/dom";
import className = DOM.className;


let vf_className = ['form-error'],
    validHandler = (valid, input, g, f) => className(input, vf_className, !valid);


export class ViewForm extends Forms {

    private _handler

    constructor(ele: HTMLElement) {
        super(ele);
        let handler = this._handler = () => className(ele, vf_className, !this.valid(validHandler))

        ele.addEventListener('keyup', handler);
        ele.addEventListener('change', handler);
        ele.addEventListener('click',
            (e) => e.target['hasAttribute']('data-cancel') && this.detach())
    }

    reset(obj?) {
        super.reset(obj);
        this._handler();
        return this;
    }

    prepend(target: HTMLElement) {
        target.parentElement.insertBefore(this.element, target);
        return this;
    }

    appendTo(target: HTMLElement) {
        target.appendChild(this.element);
        return this;
    }
}