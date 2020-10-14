export interface iData {
    element: HTMLElement

    setIndex(i: number, totalNum: number);
}


export class ListTable<T extends iData> {

    values: T[] = [];
    sortHandler

    renderHandler: (context: this) => void

    constructor(public element: HTMLElement, public body = element) {

    }


    add(data: T[])
    add(data: T)
    add(data) {
        if (!Array.isArray(data)) data = [data];
        let {values} = this, pos = values.length, i = 0, l = data.length;
        for (; i < l; i++) {
            values.indexOf(data[i]) === -1 && (values[pos++] = data[i]);
        }
        return this.render();
    }

    remove(data: T) {
        let {values} = this, i = values.indexOf(data);
        if (i !== -1) values.splice(i, 1);
        return this.render();
    }


    render(sortHandler = this.sortHandler) {
        let
            values = sortHandler ? this.values.sort(this.sortHandler = sortHandler) : this.values,
            l = values.length,
            frag = values.reduce((frag, v, i) => {
                v.setIndex(i, l - i);
                v.element.setAttribute('data-index', <any>i);
                frag.appendChild(v.element);
                return frag;
            }, document.createDocumentFragment());
        this.body.textContent = '';
        this.body.appendChild(frag);

        if (this.renderHandler)
            this.renderHandler.call(this);

        return this;
    }
}
