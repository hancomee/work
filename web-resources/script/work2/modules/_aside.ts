import {Templates} from "../../../lib/core/_dom/_template";
import Template = Templates.Template;


@Template(document.getElementsByTagName('nav')[0], false)
export class Nav {
   static $create: (data?) => Nav

    constructor(public element: HTMLElement) {
    }

    apply() {
       return this;
    }
}