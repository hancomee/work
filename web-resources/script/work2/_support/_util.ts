export function $post(url: string, data) {
    return fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(data)
    });
}

export function $put(url: string, data) {
    return fetch(url, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(data)
    });
}

export function $delete(url: string) {
    return fetch(url, {
        method: 'DELETE',
    });
}

export function __appendFragment(templates: any[], isApply = false) {
    let fragment = document.createDocumentFragment();
    templates.forEach(v => isApply ? fragment.appendChild(v.apply().element) : fragment.appendChild(v.element));
    return fragment;
}

export function __input(handler: (files: FileList) => void, multiple = true) {
    let
        input = document.createElement('input'),
        // click()시 불필요한 이벤트 발생을 막기 위함.
        stop = (e: MouseEvent) => {
            e.stopPropagation();
            input.removeEventListener('click', stop);
        };


    input.style.display = 'none';
    input.type = 'file';
    input.multiple = multiple;
    document.body.appendChild(input);
    input.onchange = () => {
        handler(input.files);
        document.body.removeChild(input);
    }
    input.addEventListener('click', stop);
    input.click();
}