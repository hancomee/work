import {iEvents} from "../../lib/core/events";
import {__noop} from "../../lib/core/_func/_noop";


export function mapperDispatcher(handler: iEvents.dataEvent.dispatcher<any> = __noop) {
    return (t: HTMLElement, o: any, v, e) => {
        let p;
        if (!o.mapping && (p = t.getAttribute('data-mapping'))) {
            o.mapping = p;
        }
        handler(t, o, v, e);
        if ((p = t.getAttribute('data-mapper')) != null) {
            o.mapper = t;
            o.name = p;

            if(!o.mapping) o.mapping = '';

            return 'break';
        }
    }
}