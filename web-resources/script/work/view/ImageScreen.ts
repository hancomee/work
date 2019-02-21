import {ImageContainer} from "../../../lib/core/support/Imager";

export class ImageScreen extends ImageContainer {

    onClose: () => void

    constructor(ele) {
        super(ele);
        this.events.register(ele, 'click', (e) => {
            if (e.target === ele) {
                this.off();
                this.onClose && this.onClose();
            }
        })
    }

    on() {
        this.element.classList.add('on');
        super.on();
        return this;
    }

    off() {
        this.element.classList.remove('on');
        super.off();
        return this;
    }
}