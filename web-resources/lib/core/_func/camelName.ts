

export namespace CamelName {

    let r_data = /^data-/,
        r_up = /-([^-])/g,
        r_fn = (_, i) => i.toUpperCase();

    export function attrRename(s: string) {
        return s.replace(r_data, '').replace(r_up, r_fn);
    }


}