export type COOKIE_OPTIONS = { expires: number | Date, path: string, domain: string, secure: string }


export function __setCookie(str: string, options?: COOKIE_OPTIONS) {
    str.split(/;\s+/).forEach( s => {
        __cookie.apply(null, s.split('='));
    });
}

export function __cookie(name: string, value?: string, options?: COOKIE_OPTIONS) {

    if (arguments.length > 1) { // name and value given, set cookie
        options = options || <COOKIE_OPTIONS>{};
        if (value === null) {   // remove cookie
            value = '';
            options.expires = -1;
        }
        let expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        const path = options.path ? '; path=' + (options.path) : '';
        const domain = options.domain ? '; domain=' + (options.domain) : '';
        const secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');

    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
