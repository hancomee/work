

export class WorkResources {

    id: number
    path: string
    datetime: Date
    uploadtime: Date

    user: string
    content: string
    filename: string
    filetype: string

    filesize: number
    source: string

    favorite: number
    blind: number
    down: number


}

export namespace WorkResources {


    export function create(data) {
        let bean = new WorkResources();

        data.datetime = new Date(data.datetime);
        data.uploadtime = new Date(data.uploadtime);

        for(let p in data)
            bean[p] = data[p];

        return bean;
    }
}