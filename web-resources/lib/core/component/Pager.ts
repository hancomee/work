/**
 * Created by hellofunc on 2017-01-23.
 */

import {getElementsByClassName} from "../_dom/selector";

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

    page: number
    totalPages: number

    before = -1
    after = -1

    private _handler

    constructor(public container: HTMLElement, public col: number, public row: number) {

        container.classList.add('component-pager');

        this.pagerElement = getElementsByClassName(container, 'component-pager-table', 0);
        this.currentBtn = getElementsByClassName(container, 'component-pager-current', 0);
        this.prevBtn = getElementsByClassName(container, 'component-pager-prev', 0);
        this.nextBtn = getElementsByClassName(container, 'component-pager-next', 0);
        this.totalBtn = getElementsByClassName(container, 'component-pager-total', 0);

        container.addEventListener('click', (e) => {

            let target = <HTMLElement>e.target,
                num;
            if (num = target.getAttribute('data-page')) {
                this._handler(num = parseInt(num), this);
                this.render(num);
            }
            else if (num = target.getAttribute('data-nav')) {
                this.$render(this.page, this.totalPages, parseInt(num));
                e.stopPropagation();
            }
            e.preventDefault();
        });
    }

    on(handler: (page: number, context: this) => void) {
        this._handler = handler;
        return this;
    }


    setHandler(handler: (page: number, table: Pager) => void) {
        this._handler = handler;
        return this;
    }

    render(page: number, totalPages = this.totalPages) {

        let {prevBtn, nextBtn} = this;

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

        this.currentBtn.textContent = <any>page;
        this.totalBtn.textContent = <any>totalPages;

        return this.$render(page, totalPages);
    }

    private $render(page: number, totalPages: number, viewPage?:number) {
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
                    array[i++] = '<td class="link"><span data-page="' + start + '">' + start + '</span></td>';

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
