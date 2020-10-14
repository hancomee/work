
type PathMap = {
    name: string
    path: string
    childs: PathMap
}

function __loop(paths: string[], index: number, obj: PathMap) {
    if (paths.length === index) return obj;
    if (!obj[paths[index]])
        obj[paths[index]] = {
            name: paths[index],
            path: paths.slice(0, index + 1).join('/'),
            childs: {}
        };
    obj = obj[paths[index]].childs;
    return __loop(paths, index + 1, obj);
}

export function _pathMap(paths: string[]) {
    let obj = <PathMap>{};
    paths.forEach(v => __loop(v.split('/'), 0, obj));
    return obj;
}