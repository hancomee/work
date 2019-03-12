import {$extend} from "../../../lib/core/core";

export type DataTableType = {
    title: string,
    type: string,
    size: string,
    required: boolean
    list?: string[]
}

export type DataTableOrder = { key: string, value: string }

export abstract class DataTable {

    abstract query: DataQuery

    abstract $toValue
    abstract $toJSON

    abstract headers: { [key: string]: DataTableType }
    abstract table: string
    abstract name: string

    abstract converter(data: any): string[]


    toValue(v) {
        return $extend(v, v, this.$toValue);
    }

    toJSON(v) {
        return $extend({}, v, this.$toJSON);
    }
}



