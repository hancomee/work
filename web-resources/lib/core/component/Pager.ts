/**
 * Created by hellofunc on 2017-01-23.
 */

import {__findByClass} from "../_dom/_selector";

type AlikePager = { page: number, totalPages: number }

function $computeStart(n: number, size: number) {
    return (Math.floor((n - 1) / size) * size) + 1
}

// page는 1부터 시작한다.
export class Pager {


    private pagerElement: HTMLElement
    private currentBtn: HTMLElement
    private prevBtn: HTMLElement
    private nextBtn: HTMLElement
    private totalBtn: HTMLElement

    private tablePrevBtn: HTMLElement
    private tableCurrentBtn: HTMLElement
    private tableNextBtn: HTMLElement

    page: number
    totalPages: number

    before = -1
    after = -1


    constructor(public container: HTMLElement,
                public col: number,
                public row: number
    ) {

        this.prevBtn = __findByClass(container, 'pager-prev', 0);
        this.currentBtn = __findByClass(container, 'pager-current', 0);
        this.nextBtn = __findByClass(container, 'pager-next', 0);
        this.totalBtn = __findByClass(container, 'pager-total', 0);

        // 드랍다운시 펼쳐지는 테이블
        this.pagerElement = __findByClass(container, 'pager-table', 0);       // pagerElement.innerHTML = 테이블태그
        this.tablePrevBtn = __findByClass(container, 'pager-table-prev', 0);
        this.tableCurrentBtn = __findByClass(container, 'pager-table-current', 0);
        this.tableNextBtn = __findByClass(container, 'pager-table-next', 0);

        container.addEventListener('click', (e) => {
            let target = (e.target as HTMLElement).closest('[data-nav]'), num;
            if (target && (num = target.getAttribute('data-nav'))) {
                this.createTable(parseInt(num));
            }
        });
    }

    render(page: number, totalPages = this.totalPages) {

        let {prevBtn, nextBtn, currentBtn, totalBtn} = this;

        this.page = page;
        this.totalPages = totalPages;

        // before
        if (page > 1) {
            prevBtn.classList.remove('disabled');
            prevBtn.setAttribute('data-page', <any>(page - 1));
        } else {
            prevBtn.classList.add('disabled');
            prevBtn.removeAttribute('data-page');
        }

        // after
        if (page < totalPages) {
            nextBtn.classList.remove('disabled');
            nextBtn.setAttribute('data-page', <any>(page + 1));
        } else {
            nextBtn.classList.add('disabled');
            nextBtn.removeAttribute('data-page');
        }

        currentBtn.textContent = <any>page;
        totalBtn && (totalBtn.textContent = <any>totalPages);

        return this.createTable();
    }

    // write :: 2022-06-06
    private createTable(viewPage?: number) {
        let
            {col, row, page, totalPages, tablePrevBtn, tableCurrentBtn, tableNextBtn} = this,
            size = col * row,

            tableTotalPage = Math.ceil(totalPages / size),
            tablePage = viewPage != null ? viewPage - 1 : Math.floor((page - 1) / size),

            start = tablePage * size + 1,

            pos = 0,
            i = 0,
            array = [];

        for (let r = 0; r < row; r++) {
            array[i++] = '<tr>';
            for (let c = 0; c < col; c++, start++, pos++) {
                if (start === page)
                    array[i++] = '<td class="current"><span>' + start + '</span></td>';
                else if (start > totalPages)
                    array[i++] = '<td class="disabled"><span>' + start + '</span></td>';
                else
                    array[i++] = '<td class="link" data-page="' + start + '"><span data-page="' + start + '">' + start + '</span></td>';
            }
            array[i++] = '</tr>';
        }

        this.pagerElement.innerHTML = '<table><tbody>' + array.join('') + '</tbody></table>';

        if (tablePage === 0) {
            tablePrevBtn.classList.add('disabled');
            tablePrevBtn.removeAttribute('data-nav');
        } else {
            tablePrevBtn.classList.remove('disabled');
            tablePrevBtn.setAttribute('data-nav', tablePage.toString());
        }

        tableCurrentBtn.textContent = (tablePage + 1).toString();

        if (tablePage > (tableTotalPage - 2)) {
            tableNextBtn.classList.add('disabled');
            tableNextBtn.removeAttribute('data-nav');
        } else {
            tableNextBtn.classList.remove('disabled');
            tableNextBtn.setAttribute('data-nav', (tablePage + 2).toString());
        }
    }


    private $render(page: number, totalPages: number, viewPage?: number) {
        this.pagerElement.innerHTML = Pager
            .createTable(page, totalPages, this.col, this.row, viewPage).join('');
        return this;
    }
}


export namespace Pager {


    export function createTable(page: number, totalPages: number, col: number, row: number,
                                _p?: number): [string, string] {


        let
            size = col * row,

            tableTotalPage = Math.ceil(totalPages / size),
            tablePage = _p != null ? _p - 1 : Math.floor((page - 1) / size),

            start = tablePage * size + 1,

            pos = 0,
            i = 0,
            array = [];

        for (let r = 0; r < row; r++) {

            array[i++] = '<tr>';

            for (let c = 0; c < col; c++, start++, pos++) {

                if (start === page)
                    array[i++] = '<td class="current"><span>' + start + '</span></td>';
                else if (start > totalPages)
                    array[i++] = '<td class="disabled"><span>' + start + '</span></td>';
                else
                    array[i++] = '<td class="link" data-page="' + start + '"><span data-page="' + start + '">' + start + '</span></td>';

            }
            array[i++] = '</tr>';
        }


        return [

            '<div>' +
            '<span class="prev' + (tablePage === 0 ? ' disabled' : '" data-nav="' + tablePage) + '">◀</span>' +
            '<span class="number">' + (tablePage + 1) + '</span>' +
            '<span class="next' + (tablePage > (tableTotalPage - 2) ? ' disabled' : '" data-nav="' + (tablePage + 2)) + '">▶</span>' +
            '</div>',

            '<table>' + array.join('') + '</table>'
        ];
    }

}
