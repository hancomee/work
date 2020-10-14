import {Search} from "../lib/core/support/Search";
import {$get} from "../lib/core/_ajax";
import {__compileHTML} from "../lib/core/_html/_compile";
import {__findById} from "../lib/core/_dom/_selector";
import {Events} from "../lib/core/_events";


let
    $content: any[],
    screen: HTMLElement,
    _screen = (e: HTMLElement, f = true) => {
        if (!e) return;
        if (f) {
            screen && screen.classList.remove('screen');
            (screen = e).classList.add('screen');
        } else {
            e.classList.remove('screen');
            screen = null;
        }
    },
    wheelEvent = new Events(document, 'mousewheel', (e: MouseWheelEvent) => {
        if (screen) {
            e.preventDefault();
            let moving = e['wheelDelta'] < 0 ? true : false;
            if (moving) _screen(<any>screen.nextElementSibling);
            else _screen(<any>screen.previousElementSibling);
        }
    }),
    container = __findById('container'),
    _temp = __compileHTML(__findById('template').innerText),
    $render = (param = new Param().reset()) => {
        return $get('/work-resources/list?' + param.queryString()).then((v: ServerData<any>) => {
            let {totalElements, contents, totalPages, page, size} = v;
            container.innerHTML = contents.map((c, i) => {
                c['idx'] = i;   // 인덱스 설정
                return _temp(c);
            }).join('');
            $content = contents;
        });
    };

class Param extends Search {
    user: string
    content: string
    favorite: number
    blind: number
    down: number

    size = 50
}

$render();



