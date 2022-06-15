import {__findByClass, __findAll} from "../_dom/_selector";
import {__className, __hasClass} from "../_dom/_commons";

let cName = ['active'];

export class DropdownList {

    private btnEle: HTMLElement

    constructor(public container: HTMLElement) {

        this.btnEle = __findByClass(container, 'dropdown-list-btn', 0);

        container.addEventListener('click', (e) => {
            let target = <HTMLElement>e.target;
            while (target !== container) {
                if (__hasClass(target, 'data-dropdown-list')) {
                    this.active(target.getAttribute('data-dropdown-list'));
                    return;
                }
                target = target.parentElement;
            }
        });
    }


    active(key: string) {
        let {btnEle} = this;
        __findByClass(this.container, 'dropdown-list-item').forEach((e) => {
            if (e.getAttribute('data-dropdown-key') === key) {
                __className(e, cName, true);
                btnEle.textContent = e.getAttribute('data-dropdown-value') || e.textContent;
            } else __className(e, cName, false);
        });
        return this;
    }
}