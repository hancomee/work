const toggles: Toggle[] = []

document.addEventListener('click', __dispatcher);


class Toggle {
    active = false;

    constructor(public target: HTMLElement,
                public element: HTMLElement,
                private classes: string[]) {
    }

    on() {
        this.active = true;
        return this.__('remove', 'add');
    }

    off() {
        this.active = false;
        return this.__('add', 'remove');
    }

    __(a: string, b: string) {
        let {target: {classList}, classes} = this, i = 0, l = classes.length;
        for (; i < l; i++) {
            if(classes[i][0] === '!') classList[a](classes[i].slice(1));
            else classList[b](classes[i]);
        }
        return this;
    }
}

function __dispatcher(e: MouseEvent) {

    const eTarget = <HTMLElement>e.target;

    toggles.forEach(toggle => {
        // 열려진 상태이면
        if (toggle.active) {
            if(toggle.target.contains(eTarget) || !toggle.element.contains(eTarget)) toggle.off();
            else toggle.on();
        }
        else if(toggle.target.contains(eTarget)) toggle.on();

    });
}

export function __$simpleToggle(toggleElement: Element, ownerElement: Element, classNames: string[]) {
    toggles.push(new Toggle(<any>toggleElement, <any>ownerElement, classNames));
}