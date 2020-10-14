import {Mapping} from "../_dom/Mapping";
import {EventsGroup} from "../_events";
import {iMediaElement, MediaElement} from "./mediaContainer/MediaElement";
import {__findByClass} from "../_dom/_selector";
import {__selectMap} from "../_dom/_select";


export interface MediaData {
    src: string
    rotate: number
    mediaType: string
}

export type ContentData = {
    media: iMediaElement,
    body: HTMLElement,
    container: HTMLElement
}


/*
 *   이미지 엘리먼트는 반드시 아래의 양식을 준수해야 한다.
 *    <div>                                             <-- media-screen 클래스 탈착
 *          <div data-directive=" | image"></div>       <-- img엘리먼트가 자동으로 생성
 *    </div>
 *
 *    rotate정보는 반드시 필요하다.
 *    다른 정보는 모르겠지만 rotate정보만큼은 GalleryContainer에서 관리해야 한다.
 *
 */
export class MediaContainer<T extends MediaData> extends Mapping {

    onEvents: EventsGroup = new EventsGroup().off()

    data: T[]

    private metaCount: HTMLElement
    private contents: ContentData[]
    private __handler

    content: ContentData
    index: number
    _onScreen = false;


    constructor(public element: HTMLElement) {
        super();

        // 비디오 재생정보
        let videoHTMLMap = __selectMap({}, __findByClass(element, 'media-meta', 0), {
            start: '.video-repeat-start[0]',
            end: '.video-repeat-end[0]',
            currentTime: '.video-current[0]',
            duration: '.video-duration[0]',
        });

        element.addEventListener('video.update', (e) => {
            let data = e['data'], p;
            for (p in data)
                videoHTMLMap[p].textContent = data[p];
        })

        this.metaCount = __findByClass(element, 'media-meta-count', 0);

        let $self = this,
            wheelEventHandler = (e: MouseWheelEvent) => {
                if (e.target !== this.content.media.element) {
                    this.onScreen(this.index + (e.wheelDelta < 0 ? 1 : -1));
                }
            }

        this.onEvents
            .register(document, 'mousewheel', wheelEventHandler)
            .register(document, 'DOMMouseScroll', wheelEventHandler)
            .register(document, 'keydown', (e: KeyboardEvent) => {
                switch (e.keyCode) {
                    case 27 :
                        return this.offScreen();
                    case 37 :
                    case 87 :
                        return this.onScreen(this.index - 1);
                    case 39 :
                    case 69 :
                        return this.onScreen(this.index + 1)
                }
            })

        /*
         *  처음 로딩될때 image가 불려지므로 여기서 contents를 정리한다.
         */
        this.addDirective({
            image(this: MediaContainer<any>, ele: HTMLElement, data: MediaData, _df, mapping: string) {

                let
                    {parentElement: container} = ele,
                    media: iMediaElement = MediaElement.create(data.mediaType, data.src, data.rotate, ele),
                    mediaElement = media.element;

                mediaElement.classList.add('media-image');
                mediaElement.setAttribute('data-index', mapping);
                container.setAttribute('data-index', mapping);
                $self.contents[mapping] = {media: media, body: ele, container: container}
            }
        });

        /*
         *  이미지 클릭하면 data-index에 의해 해당 컨텐츠 스크린
         */
        element.addEventListener('click', (e) => {
            let
                {content} = this,
                target = <HTMLImageElement>e.target;

            if (content) {
                if (content.body === target) this.offScreen();
            }
            else if (target.classList.contains('media-image')) {
                this.onScreen(parseInt(target.getAttribute('data-index')))
            }
        });
    }

    getCurrent(): T {
        return this.index === -1 ? null : this.data[this.index];
    }

    $setHandler(handler: (val: MediaData, context: this) => void) {
        this.__handler = handler;
        return this;
    }

    $element(handler: (ele: HTMLElement, context: this) => void) {
        handler(this.element, this);
        return this;
    }

    setRotate(index: number, rotate: number) {
        this.contents[index].media.setRotate(rotate);
        return this;
    }


    onScreen(index: number) {
        let {contents, contents: {length}, element, metaCount} = this;

        if (index > -1 && index < length) {

            this.offContent();

            let {media, container} = this.content = contents[index];
            metaCount.textContent = (index + 1) + ' / ' + this.contents.length;

            if (!this._onScreen) {
                this.onEvents.on();
            }

            document.body.classList.add('media-on');
            container.classList.add('media-screen');
            element.classList.add('media-on');
            element.setAttribute('media-type', media.type);
            //window.scrollTo(0, container.parentElement.offsetTop - 100);
            media.onScreen();
            this.index = index;
            this.__handler && this.__handler(this.data[index], this);
            this._onScreen = true;
        }
        return this;
    }

    offScreen() {
        this.offContent();
        this.content = null;
        this.index = -1;
        this.onEvents.off();
        this._onScreen = false;
        return this;
    }

    private offContent() {
        if (this.content) {
            let {content: {container, media}, element} = this;

            document.body.classList.remove('media-on');
            container.classList.remove('media-screen');
            element.classList.remove('media-on');
            media.offScreen();
        }
        return this;
    }

    setData(data: MediaData[]) {
        this.contents = [];
        super.setData(data).$render(this.element);
        return this;
    }
}