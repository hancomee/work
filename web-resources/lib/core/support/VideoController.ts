import {Events, EventsGroup} from "../events";
import {__adjust, __transform} from "../position";
import {getElementsByClassName, getElementsByTagName} from "../_dom/selector";
import simpleTrigger = Events.simpleTrigger;

let
    events = ['abort', 'canplay', 'canplaythrough', 'durationchange',
        'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart',
        'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking',
        'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting',],

    _zero = (s: number) => {
        return (s < 10 ? '0' : '') + s;
    },

    __toStr = (time: number) => {
        let hour = Math.floor(time / 3600), min = Math.floor(time / 60), second = Math.floor(time % 60);
        if (hour < 0) hour = 0;
        if (min < 0) min = 0;
        return [_zero(hour), ':', _zero(min), ':', _zero(second)].join('')
    },
    __toTime = (str: string) => {
        let [h, m, s] = str.split(':');
        return (parseInt(h) * 3600) + (parseInt(m) * 60) + parseInt(s);
    };

export interface OnVideoEvent {
    currentTime: string
    start: string
    end: string
    duration: string
}

class RepeatVideo {

    element: HTMLVideoElement
    display: HTMLElement

    private _onPlayHandler;
    private _start = 0;
    private _end = 0;
    private _duration = 0;

    constructor() {
        this._onPlayHandler = (e) => {
            let {currentTime} = this.element;
            this.move(currentTime, true);
            this.triggerUpdate(currentTime);
        }
    }

    protected triggerUpdate(currentTime = this.element.currentTime) {
        simpleTrigger(this.element, 'video.update', true, true, {
            currentTime: __toStr(currentTime),
            start: __toStr(this._start),
            end: __toStr(this._end),
            duration: __toStr(this._duration)
        });
        return this;
    }


    on(element: HTMLVideoElement) {
        if (element.hasAttribute('data-repeat-start'))
            this.setStart(parseInt(element.getAttribute('data-repeat-start')));
        else this._start = 0;
        if (element.hasAttribute('data-repeat-end'))
            this.setEnd(parseInt(element.getAttribute('data-repeat-end')));
        else this._end = element.duration;

        this._duration = element.duration;

        element.addEventListener('timeupdate', this._onPlayHandler);
    }

    off() {
        this.element &&
        this.element.removeEventListener('timeupdate', this._onPlayHandler);
    }

    move(time: number, pass = false) {
        let {element, _start, _end} = this;
        if (_end < time) element.currentTime = _start;
        else if (_start > time) element.currentTime = _start;
        else if (!pass) element.currentTime = time;
    }

    setStart(v: number) {
        if (this._end > v) {
            this.element.setAttribute('data-repeat-start',
                (this._start = v) + '');
        }
        return this.triggerUpdate();
    }

    setEnd(v: number) {
        if (this._start < v) {
            this.element.setAttribute('data-repeat-end',
                (this._end = v) + '');
        }
        return this.triggerUpdate();
    }

    reset() {
        let {element} = this;
        this._start = 0;
        this._end = element.duration;
        element.removeAttribute('data-repeat-start');
        element.removeAttribute('data-repeat-end');
        return this.triggerUpdate();
    }

}

export class VideoController extends RepeatVideo {

    protected events: EventsGroup

    constructor() {

        super();
        let mouseWheelHandler = (e: MouseWheelEvent) => {
            e.wheelDelta < 0 ? -1 : 1
        }

        this.events = new EventsGroup().off()
            .register(document, 'keydown', (e: KeyboardEvent) => {
                let video = this.element,
                    duration = video.duration;

                duration = duration < 100 ? 5 : Math.floor(duration / 100);

                switch (e.keyCode) {
                    // 스페이스바 시작/중지
                    case 32 :
                        video.paused ? video.play() : video.pause();
                        return;

                    // q : 반복 리셋
                    case 81 :
                        this.reset();
                        return;
                    // a : 반복 시작
                    case 65 :
                        this.setStart(video.currentTime);
                        return;
                    // s : 반복 끝
                    case 83 :
                        this.setEnd(video.currentTime);
                        return;
                    // 90 88 67 86

                    case 90 :
                        this.move(video.currentTime - duration)
                        return;
                    case 88 :
                        this.move(video.currentTime - 1)
                        return;
                    case 67 :
                        this.move(video.currentTime + 1)
                        return;
                    case 86 :
                        this.move(video.currentTime + duration)
                }
            })
            .register(document, 'mousewheel', mouseWheelHandler)
            .register(document, 'DOMMouseScroll', mouseWheelHandler)

    }

    on(video: HTMLVideoElement) {
        super.on(this.element = video);
        this.events.on();
    }

    off() {
        super.off();
        this.events.off();
        return this;
    }

}
