import {HTML} from "../html";
import selectAll = HTML.selectAll;
import {_map} from "../_func/array";
import {DOM} from "../dom";
import className = DOM.className;

let END = ['active', 'carousel-item-next', 'carousel-item-left',
        'carousel-item-prev', 'carousel-item-right']


export function carousel(element: HTMLElement) {

    return selectAll(element, ['.carousel-item[]'], (inner: HTMLElement, _items: iEleArray) => {

        type ITEM = ReturnType<typeof register>;

        let
            $run = 0,
            $active = 1,

            items: ITEM[] = _map(_items, register),

            $timeIndex: number,
            $timeStop = true,
            $time = 3000,
            $timeLoop = () => {
                carouselCTRL.left();
                $timeStop || ($timeIndex = setTimeout($timeLoop, $time));
            },

            // 캐러셀 이동
            carouselCTRL = {
                left(target = $active === items.length - 1 ? 0 : $active + 1) {
                    if ($run === 0) {
                        items[target].left();
                        items[$active].left();
                    }
                    return carouselCTRL;
                },
                right(target = $active === 0 ? items.length - 1 : $active - 1) {
                    if ($run === 0) {
                        items[target].right();
                        items[$active].right();
                    }
                    return carouselCTRL;
                },
                move(target: number) {
                    if($active !== target) {
                        if ($active < target) carouselCTRL.left(target);
                        else carouselCTRL.right(target);
                    }
                    return carouselCTRL;
                },

                loop(time = $time) {
                    $timeStop && ($timeIndex = setTimeout($timeLoop, $time = time));
                    $timeStop = false;
                    return carouselCTRL;
                },

                loopStop() {
                    clearTimeout($timeIndex);
                    $timeStop = true;
                    return carouselCTRL;
                },
            };


        // .caraousel-item 등록
        function register(item: HTMLElement, i: number) {
            let
                {classList} = item,
                isLeft = false,
                itemCTRL = {
                    index: i,
                    left() {
                        isLeft = true;
                        $run++;
                        if (classList.contains('active'))
                            classList.add('carousel-item-left');
                        else {
                            classList.add('carousel-item-next');
                            item.offsetHeight;
                            classList.add('carousel-item-left');
                        }
                    },
                    right() {
                        isLeft = false;
                        $run++;
                        if (classList.contains('active'))
                            classList.add('carousel-item-right');
                        else {
                            classList.add('carousel-item-prev');
                            item.offsetHeight;
                            classList.add('carousel-item-right');
                        }
                    },
                };

            item.addEventListener('transitionend', (e: TransitionEvent) => {
                if ($run === 0) return;
                let wantActive  = item.className.indexOf('active') === -1;
                className(item, END, false);
                if (wantActive) {
                    className(item, 'active', true);
                    $active = i;
                }
                $run--;
            });

            if (item.className.indexOf('active') !== -1)
                $active = i;

            return itemCTRL;
        }

        return carouselCTRL;

    });
}