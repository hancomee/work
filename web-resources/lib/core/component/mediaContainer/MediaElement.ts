import {ImageController} from "../_ImageController";
import {_VideoController} from "../_VideoController";
import {__alignment} from "../../_calcurator/_image";

export interface iMediaElement {
    type: string
    element: HTMLElement

    onScreen(): this

    offScreen(): this

    setRotate(rotate: number)
}

export abstract class MediaElement<T extends HTMLElement> implements iMediaElement {

    type = 'image'
    element: T

    src: string
    rotate: number
    parent: HTMLElement
    mediaWidth: number
    mediaHeight: number

    render(rotate = this.rotate) {

        this.rotate = rotate;
        this.element.setAttribute('data-rotate', rotate.toString());

        let {mediaWidth, mediaHeight, element: {style}, parent} = this,
            [left, top, width, height] = __alignment(mediaWidth, mediaHeight, rotate, parent.offsetWidth, parent.offsetHeight);

        style.transform = 'rotate(' + rotate + 'deg)';
        style.top = top + 'px';
        style.left = left + 'px';
        style.width = width + 'px';
        style.height = height + 'px';
        return this;
    }

    setRotate(rotate: number) {
        this.render(this.rotate = rotate);
        return this;
    }

    abstract offScreen(): this

    abstract onScreen(): this
}

export namespace MediaElement {

    let

        $imager = new ImageController(),
        $video = new _VideoController(),
        types = [

            {
                check: /^image/,
                factory: class A extends MediaElement<HTMLImageElement> {
                    constructor(public src: string, public rotate: number, public parent: HTMLElement) {
                        super();
                        let img = this.element = new Image();

                        img.onload = () => {
                            this.mediaWidth = img.naturalWidth;
                            this.mediaHeight = img.naturalHeight;
                            this.render(rotate);
                            parent.appendChild(img);
                        };
                        img.src = src;
                    }

                    onScreen() {
                        $imager.on(this.parent).setImage(this.element);
                        this.render();
                        return this;
                    }

                    offScreen() {
                        $imager.off();
                        this.render();
                        return this;
                    }
                },
            },
            {
                check: /mp4$/i,
                factory: class A extends MediaElement<HTMLVideoElement> {
                    constructor(public src: string,
                                public rotate: number,
                                public parent: HTMLElement,
                                public promise?: Promise<HTMLVideoElement>) {
                        super();
                        let
                            image = new Image(),
                            video = this.element = document.createElement('video'),
                            poster = src.substring(0, src.lastIndexOf('.')) + '.jpg';
                        this.type = 'video';

                        video.setAttribute('controls', 'true');
                        image.onload = () => {
                            video.poster = poster;
                            this.mediaWidth = image.naturalWidth;
                            this.mediaHeight = image.naturalHeight;
                            this.render(rotate);
                            parent.appendChild(video);
                        }

                        video.setAttribute('loop', '');
                        image.src = poster;

                    }

                    onScreen() {
                        this.render();
                        let {element, promise} = this;
                        if (!promise) {
                            element.src = this.src;
                            promise = this.promise = new Promise<HTMLVideoElement>((o) => {
                                element.onloadeddata = () => {
                                    o(element);
                                }
                            })
                        }
                        
                        element.poster = '';

                        element.setAttribute('data-screen', 'true');
                        promise.then((element) => {
                            if (element.hasAttribute('data-screen')) {
                                element.play();
                                $video.on(element);
                            }

                        })


                        return this;
                    }

                    offScreen() {
                        this.render();
                        let {element} = this;
                        element.removeAttribute('data-screen');
                        element.pause();
                        $video.off();
                        return this;
                    }
                },
            },
            {
                check: /^video/,
                factory: class A extends MediaElement<HTMLImageElement> {
                    constructor(public src: string, public rotate: number, public parent: HTMLElement) {
                        super();
                        let img = this.element = new Image();

                        img.onload = () => {
                            this.mediaWidth = img.naturalWidth;
                            this.mediaHeight = img.naturalHeight;
                            this.render(rotate);
                            parent.appendChild(img);
                        };

                        img.src = src.substring(0, src.lastIndexOf('.')) + '.jpg';
                    }

                    onScreen() {
                        $imager.on(this.parent).setImage(this.element);
                        this.render();
                        return this;
                    }

                    offScreen() {
                        $imager.off();
                        this.render();
                        return this;
                    }
                },
            },
        ];

    export function create(mediaType: string, src: string, rotate: number,
                           parent: HTMLElement): MediaElement<HTMLElement> {

        let i = 0, l = types.length;
        for (; i < l; i++)
            if (types[i].check.test(mediaType))
                return new types[i].factory(src, rotate, parent);
        return null;
    }

}