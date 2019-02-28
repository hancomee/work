

interface ServerData<T> {
    page: number
    size: number
    totalElements: number
    totalPages: number
    contents: T[]
}

interface ListData<T> extends ServerData<T> {

    state: number
    orders: string
    states: {name: string, count: number, price: number, index: number}[]
    count: number[]
    price: number[]
    today: number[]

}

type UploadData = File | Blob
type UploadObject = { name: string, data: UploadData }

type MappingDirective = (ele: HTMLElement, data) => void
type MappingTemplate = (data, target: HTMLElement) => HTMLElement


