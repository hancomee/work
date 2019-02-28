import {Customer, Work, WorkFile, WorkItem, WorkMemo} from "./Work";
import {$extend} from "../../../lib/core/core";
import {Formats} from "../../../lib/core/format";
import datetime = Formats.datetime;
import {$get} from "./_ajax";


let
    $disassemble = {
        date(v) {
            if (!v) return null;
            return v instanceof Date ? v : new Date(v)
        },
    },

    // 객체를 json data로 변경할때
    $assemble = (function () {
        let $$ = {
            date(v) {
                return datetime(v)
            },
        }

        return (data) => $extend({}, data, $$);
    })();


export class Receivable {
    id: number
    date: Date
    customer: string
    name: string
    subject: string
    sum: number
    tel: string
    memo: string

    constructor(data) {
        data && $extend(this, data, $disassemble);
    }
}


export namespace Receivable {

    export function getAll(): Promise<Receivable[]> {
        return $get('/work/receivable/list').then( v => {
            return v.map( data => new Receivable(data));

        })
    }

}