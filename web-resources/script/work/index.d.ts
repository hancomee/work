interface ServerData<T> {

    state: number
    page: number
    size: number
    totalElements: number
    totalPages: number
    contents: T[]

    count: number[]
    price: number[]
}

type UploadData = File | Blob
type UploadObject = { name: string, data: UploadData }

type MappingDirective = {
    [index: string]: (ele: HTMLElement, data) => void
}

type MappingTemplate = {
    [index: string]: (target: HTMLElement, data) => HTMLElement
}


