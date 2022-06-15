let input: HTMLInputElement

/*
 *  input을 계속 만들되, 하나의 인풋만 body에 달려있도록 한다.
 */
export function _recieveFiles(handler: (files: FileList) => void, multiple: boolean = true) {
    let {body} = document;

    if(input) {
        body.removeChild(input);
    }

    input = <HTMLInputElement>document.createElement('input');
    input.type = 'file';
    input.multiple = multiple;
    input.style.display = 'none';

    input.onchange = () => {
        handler(input.files);
    };

    body.appendChild(input);
    input.click();
}