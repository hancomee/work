
export type VIEW_DATA = { work: WORK, items: [] };
export type WORK = { state: number, title: string, customer, memo: WORK_MEMO[], refs: WORK_FILE[] }
export type WORK_FILE = { id: number, datetime: number, content_type: string, filetype: string, original_name: string, size: number };
export type WORK_MEMO = { id: number, datetime: number, value: string };