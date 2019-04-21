
export class BankAccount implements iDataTable {

    query = {
        page: 1,
        size: 30,
        order: '<id',
    }

    table = 'bank_account'
    name = '계좌번호관리'

    headers = [
        {name: 'bank', size: '10%', title: '은행', type: 'text', align: 'center', required: true},
        {name: 'nums', size: '25%', title: '계좌번호', type: 'numeric', align: 'center', required: true},
        {name: 'owner', size: '25%', title: '예금주', type: 'text', align: 'center', required: true},
        {name: 'memo', size: '40%', title: '메모', type: 'text', align: 'center', required: false},
    ]
}

