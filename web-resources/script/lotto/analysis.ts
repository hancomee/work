import {Lotto} from "./lotto";
import $list = Lotto.$list;
import array45 = Lotto.array45;


function zipper<T, V>(r: T[], handler: (a: T, b: T, i: number, r: V) => void, o: V): V {
    let i = 0, ii = 0, l = r.length;
    for (; i < l; i++) {
        ii = i + 1;
        if (ii < l)
            handler(r[i], r[ii], i, o);
    }
    return o;
}

let analysis = {


    con(list: Lotto[]) {
        let r = array45();

    }

}


$list().then(list => {


});