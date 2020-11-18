import {Events} from "../lib/core/_events";
import __$dataEvent = Events.__$dataEvent;
import {Templates} from "../lib/core/_dom/_template";
import __templateApply = Templates.__templateApply;
import {__testHandlers} from "../lib/core/_test";
import {Formats} from "../lib/core/_format";
import __filterParser = Formats.__filterParser;
import {Arrays} from "../lib/core/_array";
import __forEach = Arrays.__forEach;

let {body} = document,
    r = /-./g;

console.log('data-not-sex-man-woman'.replace(r, (v) => v[1].toUpperCase()));