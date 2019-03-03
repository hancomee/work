

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
type MappingTemplate = (data) => HTMLElement
type MappingDirectives = { [index: string]: MappingDirective };
type MappingTemplates = { [index: string]: MappingTemplate };

interface iMapping {
    directive: MappingDirectives
    template: MappingTemplates
    readData(mapping: string): any
    createTemplate(name: string, data): HTMLElement

    $render(ele: HTMLElement, data?: any): HTMLElement
    $follow(name: string): this
}


interface iMapperObject {
    name: string
    mapping: string
    mapper: HTMLElement
}