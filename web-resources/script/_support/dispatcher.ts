import {Events} from "../../lib/core/_events";
import {__noop} from "../../lib/core/_snippet/_noop";
import DATA_EVENT_INTERCEPTOR = Events.DATA_EVENT_INTERCEPTOR;


export function dispatcher() {

}

export function mapperDispatcher(handler: DATA_EVENT_INTERCEPTOR<any> = __noop) {
    return (t: HTMLElement, o: any, v, e) => {
        let p;
        if (!o.mapping && (p = t.getAttribute('data-mapping'))) {
            o.mapping = p;
        }
        handler(t, o, v, e);
        if (!o.mapper && ((p = t.getAttribute('data-mapper')) != null)) {
            o.mapper = t;
            o.name = p;
            if(!o.mapping) o.mapping = '';
        }
    }
}