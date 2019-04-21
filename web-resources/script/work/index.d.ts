

interface ListData<T> extends ServerData<T> {

    state: number
    orders: string
    states: {name: string, count: number, price: number, index: number}[]
    count: number[]
    price: number[]
    today: number[]

}

