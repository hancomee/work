
interface ServerData<T> {
    page: number
    size: number
    totalElements: number
    totalPages: number
    contents: T[]
}

export interface ListData extends ServerData<WORK> {
    state: number
    orders: string
    states: {name: string, count: number, price: number, index: number}[]
    count: number[]
    price: number[]
    today: number[]
}

export type CUSTOMER = {
    id: number
    name: string
    owner: string
    biz_num: string
    biz_con: string
    biz_type: string
    memo: string
    tel: string
    mobile: string
    email: string
    fax: string
}

export type VIEW_DATA = { work: WORK, items: [] };
export type WORK = {
    id: number
    state: number, title: string, customer,
    memo: WORK_MEMO[], refs: WORK_FILE[], activetime: number
    customer_id: number
    datetime: number
    updatetime: number


    file_len: number
    item_len: number
    memo_len: number

    text: string
    price: number
    vat: number
    total: number
    uuid: string
}
export type WORK_ITEM = {
    count: number
    datetime: number
    detail: string
    draft: WORK_FILE[]
    id: number
    memo: string
    price: number
    print: WORK_FILE[]
    priority: number
    subject: string
    total: number
    value: number       // 공급가액
    vat: number
    work_id: number
}

export type WORK_FILE = { id: number, datetime: number, content_type: string, filetype: string, save_name: string, original_name: string, size: number };
export type WORK_MEMO = { id: number, datetime: number, value: string };