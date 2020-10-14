

export function __zeroFill(num: number, size: number) {
    let val = num.toString(), l = val.length;
    for(;l<size;l++)
        val = '0' + val;
    return val;
}