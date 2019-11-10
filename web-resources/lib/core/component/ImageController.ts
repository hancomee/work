import {EventsGroup} from "../events";
import {__transform} from "../_calcurator/_image";


export class ImageController {

    element: HTMLElement
    imager: Imager
    protected events: EventsGroup
    protected cliendRect: ClientRect

    constructor() {

        let
            handler,
            mouseWheelHandler = (e: MouseWheelEvent) => {
                if (e.target === this.imager.element) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.wheelZoom(e);
                }
            };

        this.events = new EventsGroup().off()
            .register(document, 'mousedown', (e: MouseEvent) => {
                if (this.element.contains(<HTMLElement>e.target) && this.imager) {
                    handler = this.move(e);
                    e.stopPropagation();
                }
            })
            .register(document, 'mouseup', () => handler = null)
            .register(document, 'mousemove', (e: MouseEvent) => handler && handler(e))

            // 마우스 휠로 확대 축소
            .register(document, 'mousewheel', mouseWheelHandler)
            .register(document, 'DOMMouseScroll', mouseWheelHandler)
            // 더블클릭으로 그림 회전
            .register(document, 'dblclick', (e: MouseEvent) => {
                if (this.element.contains(<HTMLElement>e.target) && this.imager) {
                    this.imager.rotate += e.ctrlKey ? -90 : 90;
                    e.stopPropagation();
                }
            })
            // 이미지 움직일때 드래그 이벤트 봉쇄
            .register(document, 'dragstart', (e) => this.imager && e.preventDefault())

    }

    on(element: HTMLElement) {
        this.element = element;
        this.cliendRect = element.getBoundingClientRect();
        this.events.on();
        return this;
    }

    off() {
        this.element = this.cliendRect = this.imager = null;
        this.events.off();
        return this;
    }

    setImage(image: HTMLImageElement) {
        //let {element, element: {offsetWidth, offsetHeight}} = this;
        this.imager = new Imager(image)
           // .setSize(__adjust(offsetWidth, offsetHeight, image.naturalWidth, image.naturalHeight, true));
        return this;
    }


    render(rotate = 0) {
        
    }

    // 이미지 줌
    private wheelZoom(e: MouseWheelEvent) {
        let
            img = this.imager,
            {clientX: pageX, clientY: pageY} = e,
            {left: boundingLeft, top: boundingTop} = this.cliendRect,
            {top, left, width, height} = img,
            ratioX = (pageX - left - boundingLeft) / width, ratioY = (pageY - top - boundingTop) / height,
            zoom = e.wheelDelta < 0 ? -1 : 1,
            widthAdd = (width * .3) * zoom;

        if (width + widthAdd < 300) img.setWidth(300);
        else img.addWidth(widthAdd)

        img.left = (left - ((img.width - width) * ratioX))
        img.top = (top - ((img.height - height) * ratioY))
    }

    // 이미지 이동
    private move(e: MouseEvent, img = this.imager) {
        let {pageX, pageY} = e, {left, top} = img;

        return function (e: DragEvent) {
            img.left = left + e.pageX - pageX;
            img.top = top + e.pageY - pageY;
        }
    }

}


export class Imager {

    CSSStyle: CSSStyleDeclaration

    set zIndex(v: number) {
        this.CSSStyle.zIndex = v.toString();
    }

    get zIndex() {
        return parseInt(this.CSSStyle.zIndex);
    }

    set left(v: number) {
        this.CSSStyle.left = v + 'px';
    }

    get left() {
        return parseInt(this.CSSStyle.left);
    }

    set top(v: number) {
        this.CSSStyle.top = v + 'px';
    }

    get top() {
        return parseInt(this.CSSStyle.top);
    }

    set width(v: number) {
        this.CSSStyle.width = v + 'px';
    }

    get width() {
        return parseInt(this.CSSStyle.width);
    }

    set height(v: number) {
        this.CSSStyle.height = v + 'px';
    }

    get height() {
        return parseInt(this.CSSStyle.height);
    }

    set rotate(v: number) {
        this.CSSStyle.transform = 'rotate(' + v + 'deg)';
    }

    get rotate() {
        return __transform(this.CSSStyle.transform);
    }

    set position(v: string) {
        this.CSSStyle.position = v;
    }

    get position() {
        return this.CSSStyle.position;
    }

    // style을 설정한다.
    constructor(public element: HTMLImageElement) {

        this.CSSStyle = element.style

        this.left = 0;
        this.top = 0;
        this.width = element.naturalWidth;
        this.height = element.naturalHeight;
        this.position = 'relative';
    }

    setSize({w, h, x, y}) {
        this.left = x;
        this.top = y;
        this.width = w;
        this.height = h;
        return this;
    }

    // 정중앙 정렬
    center(W: number, H: number) {
        let {width, height} = this;
        this.left = Math.ceil((W - width) / 2);
        this.top = Math.ceil((H - height) / 2);
        return this;
    }

    $setSize(drive: number, change: number, driven: number) {
        return {driven: driven + (driven * (change / drive)), drive: drive + change};
    }

    // 가로 사이즈 비율에 맞게 전체 사이즈 조정
    setWidth(v: number) {
        return this.addWidth(v - this.width);
    }

    setHeight(v: number) {
        return this.addHeight(v - this.height);
    }

    // (+-)v 값만큼 크기 조정.
    addWidth(v: number) {
        let {drive, driven} = this.$setSize(this.width, v, this.height);
        this.width = drive;
        this.height = driven;
        return this;
    }

    addHeight(v: number) {
        let {drive, driven} = this.$setSize(this.height, v, this.width);
        this.width = driven;
        this.height = drive;
        return this;
    }

}