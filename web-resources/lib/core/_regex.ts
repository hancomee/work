

export namespace Regex {

    type Context = { index: number, length: number, exec: RegExpExecArray };

    export function __map<T>(str: string, r: RegExp, handler: (this: Context, args: Context) => T): T[] {

        if (!str) return [];

        let reg: RegExpExecArray[] = [], array = [], pos = 0, i = 0,
            m: RegExpExecArray;

        while (m = r.exec(str)) {
            r.lastIndex = m.index + m[0].length;
            reg[pos++] = m;
        }

        let obj = {index: -1, length: pos, exec: null};

        while (i < pos) {
            obj.exec = reg[i];
            obj.index = i;
            array[i] = handler.call(obj, obj);
            i++;
        }

        return array;
    }

}