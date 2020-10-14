
/*
 *  page: 현재페이지
 *  totalPages: 전체 페이지
 *
 *  col : 나타낼 링크 열수
 *  row : 나타낼 링크 행수
 *
 *  _tablePage : 테이블 페이징
 */
export function __pager(page: number, totalPages: number, col: number, row: number,
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


    return  {
        page: page,
        totalPages: totalPages,
        tPage: (tablePage + 1),
        prev: (tablePage === 0) ? -1 : tablePage,
        next: tablePage > (tableTotalPage - 2) ? -1 : tablePage + 2,
        numbers: rowArray
    };
}

