type Arg = {
    page: number
    totalPages: number
}

type TableArg = {
    page: number, totalPages: number, col: number, row: number
}

/*
 *  page: 현재페이지
 *  totalPages: 전체 페이지
 *
 *  col : 나타낼 링크 열수
 *  row : 나타낼 링크 행수
 *
 *  _tablePage : 테이블 페이징
 */
export function __pagerTable({page, totalPages, col, row}: TableArg,
                             _tablePage?: number) {


    let
        size = col * row,
        tableTotalPage = Math.ceil(totalPages / size),
        tablePage = _tablePage != null ? _tablePage - 1 : Math.floor((page - 1) / size),
        num = tablePage * size + 1,

        colArray: number[],
        rowArray: number[][] = [];

    for (let r = 0; r < row; r++) {

        colArray = rowArray[r] = [];

        for (let c = 0; c < col; c++, num++) {

            // 현재페이지
            if (num === page)
                colArray[c] = num;
            // 더 이상 없을때
            else if (num > totalPages)
                colArray[c] = -1;
            else
                colArray[c] = num;

        }
    }


    return {
        page: page,
        totalPages: totalPages,
        tPage: (tablePage + 1),
        prev: (tablePage === 0) ? -1 : tablePage,
        next: tablePage > (tableTotalPage - 2) ? -1 : tablePage + 2,
        numbers: rowArray
    };
}


// next, prev 없을땐 0
export function __pager(arg: Arg, links: number) {

    let {page, totalPages} = arg,
        flag = page > links,
        val, array = [];

    if (flag) val = (Math.floor((page - 1) / links) * links) + 1;
    else val = 1;

    totalPages++;

    // 배열만들기
    for (let i = 0; i < links && val < totalPages; i++)
        array[i] = val++;

    return {
        current: page,
        next: val < totalPages ? val : 0,
        prev: flag ? array[0] - 1 : 0,
        links: array
    }

}