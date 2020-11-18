

(function () {

    if (window['___toggle-hover___']) return;
    window['___toggle-hover___'] = true;


    document.addEventListener('mouseover', (e) => {
        let target = e.target as HTMLElement;
        if(target.getAttribute('data-toggle') === 'hover') {
            let v;
            while(target = target.parentElement) {
                if(v = target.getAttribute('data-hover')) {
                    return target.classList.add(v);
                }
            }
        }
    });

    document.addEventListener('mouseout', (e) => {
        let target = e.target as HTMLElement;
        if(target.getAttribute('data-toggle') === 'hover') {
            let v;
            while(target = target.parentElement) {
                if(v = target.getAttribute('data-hover')) {
                    return target.classList.remove(v);
                }
            }
        }
    });
})();


