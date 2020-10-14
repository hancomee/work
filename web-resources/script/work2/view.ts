import {Arrays} from "../../lib/core/_array";
import {Mappings} from "../../lib/core/_dom/_template";
import {$get} from "../../lib/core/_ajax";
import {Events} from "../../lib/core/_events";
import __reduceN = Arrays.__reduceN;
import Template = Mappings.Template;
import __templateMap = Mappings.__templateMap;
import __$dataEvent = Events.__$dataEvent;
import $TEMPLATE_KEY$ = Mappings.$TEMPLATE_KEY$;

let
    $view = document.getElementById('view'),
    temps = __templateMap($view);


@Template(temps.work, false)
class Work {

    static $create: (data?) => Work

    $items: Item[] = [];
    customer: Customer

    constructor(public element: HTMLElement, public itemContainer: HTMLElement,
                public work, public items) {
        this.addItem(items);
        this.customer = Customer.$create({customer: work.customer, work: this}).apply();
    }

    addItem(item: {} | {}[]) {
        let values = (Array.isArray(item) ? item : [item]).map(v => Item.$create({item: v, work: this}).apply());
        this.$items = this.$items.concat(values)
        this.refresh();
        return this;
    }

    removeItem(item: Item) {
        let {$items} = this;
        $items.splice($items.indexOf(item), 1);
        this.refresh();
    }

    private refresh() {
        let {itemContainer} = this;
        itemContainer.textContent = '';
        itemContainer.appendChild(__reduceN(this.$items,
            (r, v) => r.appendChild(v.element), document.createDocumentFragment()
        ));
    }

    apply() {
        return this;
    }

}

@Template(temps.customer, false)
class Customer {
    static $create: (data?) => Work

    constructor(public element: HTMLElement, public customer, public work: Work) {
    }

    apply() {
        return this;
    }
}


@Template(temps.item)
class Item {
    static $create: (data?) => Item

    constructor(public element: HTMLElement, public work: Work, public item) {
    }

    apply() {
        return this;
    }
}

@Template(temps.itemForm)
class ItemForm {
    static $create: (data?) => ItemForm

    inputs

    constructor(public element: HTMLElement, public data?) {
        __reduceN(element.getElementsByTagName('input'), (r, i) => {
            r[i.name] = i;
        }, {});
    }

    put(item?: Item) {
        if(this.data = item) {
            item.element.parentElement.insertBefore(this.element, item.element);
        }
        return this;
    }

    apply() {
        return this;
    }
}

$get('/work/view?uuid=2020-1000769').then(data => {
    let work = Work.$create(data).apply(),
        itemForm = ItemForm.$create()

    type D_DATA = { element: HTMLElement };
    __$dataEvent($view, 'click', 'data-event', {
        removeItem(data: D_DATA) {
            let item: Item = data.element[$TEMPLATE_KEY$];
            item.work.removeItem(item);
            console.log(item);
        },
        modifyItem({element}) {
            let item: Item = element[$TEMPLATE_KEY$];
            itemForm.put(item).apply();
        }
    });

});