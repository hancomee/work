
let
    r_base64_cut = /:([^;]+)/

/*
 *
 *   base64 ==> binary data
 *
 *   데이터타입을 유추해야 하므로,
 *   반드시 data:image/png;base64 로 시작하는 텍스트를 입력해야 한다.
 */
export function __base64ToBlob(base64: string) {

    let [header, src] = base64.split(/,/),
        contentType = r_base64_cut.exec(header)[1],
        byteCharacters = atob(src),
        offset = 0,
        len = byteCharacters.length,
        byteNumbers = new Array(len);

    for (; offset < len; offset++) {
        byteNumbers[offset] = byteCharacters.charCodeAt(offset);
    }
    return new Blob([new Uint8Array(byteNumbers)], {type: contentType});
}
