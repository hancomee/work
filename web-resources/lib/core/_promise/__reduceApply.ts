import resolve = Promise.resolve;


export function __reduceApply(promises: Array<() => Promise<any>>, time = 0) {

    return promises.reduce((promise, fn) => {
        return promise.then(() => {
            return new Promise((resolve) => {
                fn().then(() => setTimeout(() => resolve(), time));
            });
        });
    }, Promise.resolve());

}