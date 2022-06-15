

export function __input(handler: (files: FileList) => void) {
    let input = document.createElement('input');
    input.style.display = 'none';
    input.type = 'file';
    input.multiple = true;
    document.body.appendChild(input);
    input.onchange = () => {
        handler(input.files);
        document.body.removeChild(input);
    }
    input.click();
}