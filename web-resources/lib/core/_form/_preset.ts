// 인풋 자동완성 등 제거
((eles: NodeListOf<HTMLInputElement>) => {
    let i = eles.length;
    while (i-- > 0) {
        eles[i].autocomplete = eles[i].autocapitalize = 'off';
        eles[i].spellcheck = false;
    }
})(document.querySelectorAll('[name]'));
