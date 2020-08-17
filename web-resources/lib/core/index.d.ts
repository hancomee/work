// typesciprt 에서 import dd from '.html' 을 가능하게 해준다.
declare module '*.html' {
    const value: string;
    export = value
}

declare function require(source: string);

interface iCompile {
    (obj: any): string
}

type iParseResult = [iCompile, iCompileMap];

type iCompileMap = { [index: string]: iCompile }

interface iCompileHandler<T> {
    (data: T): string
}


interface iResponseResult<T> {
    totalPages: number
    count: number
    values: T[]
    page: number
}

type iEleArray = ArrayLike<HTMLElement>

interface iEleMapEach {
    [key: string]: (e: HTMLElement, obj) => void
}

interface iEleMap extends ArrayLike<HTMLElement> {

    keys: string[]

    length: number

    setText(obj?, map?): this

    each<T>(h: (e: HTMLElement, name: string, obj: T) => void, value?: T, each?: iEleMapEach): this

}

declare namespace iLocation {

    export interface iSearch {
        reset(search?: string): this

        extend(obj: {})

        hash(): this

        queryString(extend?: {}): string
    }
}

declare namespace iSPA {

    export interface Info {
        pathname: string
        param
        index: number
        beforeIndex: number

        way: number
    }

    export interface config {

        defaultURL: string

        before?(info: Info): Promise<any> | void

        onChange(currentElement: HTMLElement, beforeElement: HTMLElement, info: Info)

        after?(info: Info): Promise<any> | void
    }

    export interface factory<T> {
        new(): module<T>
    }


    export interface module<T> {

        getParam(): T

        init(): Promise<HTMLElement>

        load(param: T, search: string, element: HTMLElement): Promise<any> | void

        close(): Promise<any> | void
    }
}

interface DropdownEvent extends Event {
    data: {
        isOpen: boolean
        dropdown: HTMLElement
        target: HTMLElement
    }
}


interface DataQuery {
    page?: number
    size?: number
    order?: string
    startWith?: { [key: string]: string }
    contains?: { [key: string]: string }
    endWith?: { [key: string]: string }
    duration?: { [key: string]: [string, string] }
    greater?: { [key: string]: number }
    lesser?: { [key: string]: number }
    equals?: { [key: string]: string | number }
}


interface ServerData<T> {
    page: number
    size: number
    totalElements: number
    totalPages: number
    contents: T[]
}

type UploadData = File | Blob
type UploadObject = { name: string, data: UploadData }

type MappingDirective = (ele: HTMLElement, data, exp: string, mapping: string) => void
type MappingTemplate = (data) => HTMLElement
type MappingDirectives = { [index: string]: MappingDirective };
type MappingTemplates = { [index: string]: MappingTemplate };

interface iMapping {
    directive: MappingDirectives
    template: MappingTemplates
    html: {[index: string]: (data) => string}
}


interface iMapperObject {
    name: string
    mapping: string
    mapper: HTMLElement
}

interface TagNameMap extends HTMLElementTagNameMap {
    "main": HTMLElement;
}