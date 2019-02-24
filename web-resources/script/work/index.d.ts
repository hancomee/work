interface ListData<T> {

    state: number
    page: number
    size: number
    totalElements: number
    totalPages: number
    contents: T[]

    orders: string
    states: {name: string, count: number, price: number, index: number}[]
    count: number[]
    price: number[]

}

type UploadData = File | Blob
type UploadObject = { name: string, data: UploadData }

type MappingDirective = (ele: HTMLElement, data) => void
type MappingTemplate = (target: HTMLElement, data) => HTMLElement


