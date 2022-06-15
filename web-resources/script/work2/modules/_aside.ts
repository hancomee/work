import {Template} from "../../../lib/core/_dom/_template";


@Template(document.getElementsByTagName('nav')[0], false)
export class Nav {
   static $create: (data?) => Nav

    constructor(public element: HTMLElement) {
    }

    apply() {
       return this;
    }
}