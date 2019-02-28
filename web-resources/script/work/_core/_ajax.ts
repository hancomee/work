
export function $get(url: string): Promise<any> {
    return new Promise((resolve, error) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
                else error(xhr);
            }
        }
        xhr.open('GET', url, true);
        xhr.send(null);
    });
}


export function $post(url: string, data): Promise<any> {
    return new Promise((resolve, error) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200)
                    resolve(xhr.responseText && JSON.parse(xhr.responseText));
                else error(xhr);
            }
        }
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    });
}

export function $delete(url: string): Promise<any> {
    return new Promise((resolve, error) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) resolve();
                else error(xhr);
            }
        }
        xhr.open('DELETE', url, true);
        xhr.send(null);
    });
}
