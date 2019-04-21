type DataTableType = {
    name: string
    title: string,
    type: string,
    size: string,
    required: boolean
    list?: string[]

    toValue?(v): any
    toJSON?(v): string
    converter?(v, obj): string
}

type DataTableOrder = { key: string, value: string }

interface iDataTable {
    query: DataQuery
    headers: DataTableType[]
    table: string
    name: string
}
