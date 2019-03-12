import {DataTable} from "./_DataTable";
import {Formats} from "../../../lib/core/format";
import datetime = Formats.datetime;
import number = Formats.number;


export class BankAccount extends DataTable {

    query = {
        page: 1,
        size: 30,
        order: '<id',

    }

    $toValue = {}

    $toJSON = {}

    table = 'bank_account'
    name = '계좌번호관리'

    headers = {
        bank: {size: '20%', title: '은행', type: 'text', required: true},
        nums: {size: '20%', title: '계좌번호', type: 'numeric', required: true},
        owner: {size: '20%', title: '예금주', type: 'text', required: true},
        memo: {size: '20%', title: '메모', type: 'text', required: false},
    }

    converter(v) {
        return [v.bank, v.nums, v.owner, v.memo]
    }
}

