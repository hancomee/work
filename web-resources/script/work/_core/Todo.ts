import {Work} from "./Work";
import {$extend} from "../../../lib/core/core";
import {$delete, $get, $post} from "../../../lib/core/_util/_ajax";
import {Formats} from "../../../lib/core/support/Formats";
import datetime = Formats.datetime;


let
    $disassemble = {
        datetime(v) {
            if (!v) return null;
            return v instanceof Date ? v : new Date(v)
        },
    },

    // 객체를 json data로 변경할때
    $assemble = (function () {
        let $$ = {
            datetime(v) {
                return datetime(v)
            },
        }

        return (data) => $extend({}, data, $$);
    })();


export class Todo {
    id: number
    datetime: Date
    value: string

    constructor(data) {
        data && $extend(this, data, $disassemble);
    }
}


export namespace Todo {

    export function save(todo: Todo) {
        return $post('/work/db/todo', $assemble(todo)).then(id => {
            todo.id = id;
            return todo;
        });
    }

    export function remove(id) {
        return $delete('/work/db/todo/' + id)
    }

    export function update(id, value) {
        return $post('/work/db/todo/' + id, {value: value})
    }

    export function list(): Promise<Todo[]> {
        return $get('/work/db/todo/list').then(list => {
            return list.map(v => new Todo(v));
        })
    }
}