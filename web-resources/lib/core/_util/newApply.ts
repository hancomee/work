
let {bind} = Function.prototype;

export function __newApply(cons, args: any[]) {
    return new (bind.apply(cons, [null].concat(args)));
}
