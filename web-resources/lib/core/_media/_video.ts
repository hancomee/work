let {every} = Array.prototype;

function __check() {
    let video;
    every.call(document.querySelectorAll(':hover'), (e, i) => {
        if (i = /video/i.test(e.tagName)) video = e;
        return !i;
    })
    return video;
}

/*
 *  참고) tab-index는 해당 엘리먼트에 focus가 있을때만 키이벤트를 수신한다.
 */
export function __video(container: HTMLElement) {

    // key이벤트를 수신하기 위함
    container.tabIndex = -1;
    container.style.outline = '0';

    /*
     *  repeat 설정을 위한 이벤트캡쳐.
     *  timeupdate는 버블링이 안되므로 이벤트캡쳐로 수신한다.
     */
    container.addEventListener('timeupdate', (e) => {
        let video = <HTMLVideoElement>e.target,
            {currentTime} = video,
            start = parseInt(video.getAttribute('x-start')) || 0,
            end = parseInt(video.getAttribute('x-end')) || 99999999;

        if (currentTime < start) video.currentTime = start;
        if (currentTime > end) video.currentTime = start;

    }, true);

    container.addEventListener('keydown', (e) => {
        let video = __check();
        if (!e.ctrlKey && !e.shiftKey && !e.altKey && video && !video.hasAttribute('disabled')) {
            if (e.key === 'b') {
                video.paused ? video.play() : video.pause();
            }
            if (video.duration > 0) {
                switch (e.key) {
                    case 'z' :
                        return video.currentTime -= 10;
                    case 'v' :
                        return video.currentTime += 10;
                    case 'x' :
                        return video.currentTime -= 1;
                    case 'c' :
                        return video.currentTime += 1;
                    case 'a' :
                        return video.setAttribute('x-start', video.currentTime);
                    case 's' :
                        return video.setAttribute('x-end', video.currentTime);
                    case 'd' :
                        video.removeAttribute('x-start');
                        video.removeAttribute('x-end');
                }
            }
        }
    });
}