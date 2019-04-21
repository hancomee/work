import {ImageController} from "../../../lib/core/support/ImageController";

export class ImageScreen extends ImageController {

    onClose: () => void

    constructor(ele) {
        super();

        this.element = ele;
        this.cliendRect = ele.getBoundingClientRect();

        this.events.register(ele, 'click', (e) => {
            if (e.target === ele) {
                this.off();
                this.onClose && this.onClose();
            }
        })
    }

    putImage(image: HTMLImageElement) {
        this.element.textContent = '';
        this.element.appendChild(image);
        super.setImage(image);
        return this;
    }

    on() {
        this.element.classList.add('on');
        this.events.on();
        return this;
    }

    off() {
        this.element.classList.remove('on');
        this.events.off();
        return this;
    }
}