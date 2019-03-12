import {DataTable} from "./_DataTable";
import {Formats} from "../../../lib/core/format";
import datetime = Formats.datetime;
import number = Formats.number;



export class Receivable extends DataTable {

    query = {
        page: 1,
        size: 30,
        order: '<date',
    }

    $toValue = {
        date: (v) => new Date(v),
    }

    $toJSON = {
        date: (v) => datetime(v)
    }

    table = 'receivable'
    name = '미수금'

    headers = {
        //list: {size: '20%', title: '리스트', type: 'list', list: ['a', 'b', 'c', 'd'], required: true},
        date: {size: '20%', title: '날짜', type: 'date', required: true, readOnly: true},
        customer: {size: '20%', title: '거래처', type: 'text', required: true},
        name: {size: '20%', title: '담당자', type: 'text', required: true},
        subject: {size: '20%', title: '품목', type: 'text', required: true},
        sum: {size: '20%', title: '금액', type: 'number', required: true},
    }

    converter(v) {
        return [datetime(v.date, 'yyyy-MM-dd(E)'), v.customer, v.name, v.subject, number(v.sum)]
    }
}

