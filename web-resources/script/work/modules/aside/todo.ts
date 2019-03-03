import {Forms} from "../../../../lib/core/form/Forms";
import {DOM} from "../../../../lib/core/dom";
import {querySelector, querySelectorCut} from "../../../../lib/core/_dom/selector";
import {$extend} from "../../../../lib/core/core";
import {Mapping} from "../../_support/Mapping";
import {Modifier} from "../../_support/mapping/Modifier";
import {Todo} from "../../_core/Todo";

class Memo {
    id: number
    datetime: Date
    value: string
}

let values = '0 1 2 3 4',
    $data = values.split(' ').map(v => {
        return {
            datetime: new Date(),
            value: v
        }
    });

export function todo(element: HTMLElement) {


    Todo.list().then($list => {

        let
            btn = querySelector(element, '[data-toggle]'),
            btnText = btn.textContent,
            lenCheck = () => {
                btn.textContent = btnText + ' (' + $list.length + ')';
            },

            templateElement = querySelectorCut(element, '[data-ignore]'),
            mapping = new Mapping()
                .setData($list)
                .addTemplate(templateElement),
            modifier = new Modifier(element, mapping)

                .$$preProcess(element, {
                    listForm(ele, modi) {
                        let forms = new Forms(ele),
                            template = querySelector(element, 'todo-list')

                    }
                })

                .addForms(templateElement, {
                    list: {
                        createForms(ele) {
                            return new Forms(ele);
                        },
                        curd: {
                            update(data, own) {
                                return Todo.update(own.id, data.value).then(() => {
                                    own.value = data.value;
                                    return own;
                                })
                            },
                            remove(own) {
                                return Todo.remove(own.id).then(() => lenCheck())
                            },
                            save(data) {
                                return Todo.save(new Todo(data)).then(v => {
                                    $list.unshift(v);
                                    lenCheck();
                                    return v;
                                })
                            }
                        }
                    }
                });

        lenCheck();
        mapping.$render(element);
    })


}