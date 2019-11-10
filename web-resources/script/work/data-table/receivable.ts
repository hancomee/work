import {Formats} from "../../../lib/core/support/Formats";
import datetime = Formats.datetime;
import number = Formats.number;


export class Receivable implements iDataTable {

    query = {
        page: 1,
        size: 30,
        order: '<date',
    }

    table = 'receivable'
    name = '미수금'

    headers = [
        {
            name: 'date', size: '10%', title: '날짜', type: 'date', required: false, readOnly: true,
            converter: (v) => datetime(v, 'yyyy-MM-dd(E)'),
            toJSON: v => datetime(v),
            toValue: v => new Date(v)
        },

        {name: 'customer', size: '25%', title: '거래처', type: 'text', required: true},

        { name: 'sum', size: '15%', title: '금액', type: 'number', align: 'right', required: true,
            converter: v => number(v) },

        {name: 'subject', size: '30%', title: '품목', type: 'text', required: false},

        {name: 'name', size: '20%', title: '담당자', type: 'text', required: false},
    ]
}

