import {Receivable} from "./_core/Receivable";
import {Mapping} from "./_support/Mapping";
import {getElementsByTagName} from "../../lib/core/_dom/selector";

let
    main = getElementsByTagName(document.body, 'main', 0),
    $mapping = new Mapping()
        .addTemplate(document.head);


Receivable.getAll().then( values => {
    $mapping.setData(values).$render(main);

})