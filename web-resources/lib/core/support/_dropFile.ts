export function __dropFile(ele: HTMLElement, handler: (data: DataTransfer, e: DragEvent) => void) {

    let {classList} = ele,
        __dispatcher = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
        }

    ele.addEventListener('dragover', __dispatcher);
    ele.addEventListener('dragenter', (e: DragEvent) => {
        __dispatcher(e);
        classList.add('drag');
    });
    ele.addEventListener('dragleave', (e: DragEvent) => {
        __dispatcher(e);
        classList.remove('drag');
    })
    ele.addEventListener('drop', (e: DragEvent) => {
        __dispatcher(e);
        handler.call(ele, e.dataTransfer, e);
        classList.remove('drag');
    });

}