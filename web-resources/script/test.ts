import {getElementsByTagName} from "../lib/core/_dom/selector";
import {PathTree} from "../lib/core/component/PathTree";

function run(fns: any[], nums: number) {

    return fns.map(f => {
        var startTime = new Date().getTime(),
            i = 0;

        for (; i < nums; i++) {
            f();
        }

        var endTime = new Date().getTime();
        return endTime - startTime;
    })
}


let src = "D:/files/video/bj/귀여울거 같은 년.mp4",
    i = src.lastIndexOf("."),
    image = new Image(),
    video = document.createElement('video'),
    source = document.createElement('source')

video.appendChild(source);

image.onload = () => {
    video.poster = image.src;
    source.src = src;
}

image.src = src.substring(0, i) + '.jpg';


document.body.appendChild(video)
;
