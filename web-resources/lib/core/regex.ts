export namespace Regex {


    export function findAll<T>(r: RegExp, target: string, f: (r: RegExpExecArray, a: string[]) => T): T[] {

        let result = [], m: RegExpExecArray,
            i = r.lastIndex = 0,
            v;

        if (!target) return result;

        do {
            if (m = r.exec(target)) {
                v = f(m, result);
                if (v != null) result[i++] = v;

            }
        } while (m);

        return result;

    }

}