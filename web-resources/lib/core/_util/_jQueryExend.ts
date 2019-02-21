function jQueryExtend(...args) {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[ 0 ] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
        deep = target;

        // Skip the boolean and the target
        target = arguments[ i ] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && typeof target !== 'function' ) {
        target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if ( i === length ) {
        target = this;
        i--;
    }

    for ( ; i < length; i++ ) {

        // Only deal with non-null/undefined values
        if ( ( options = arguments[ i ] ) != null ) {

            // Extend the base object
            for ( name in options ) {
                copy = options[ name ];

                // Prevent never-ending loop
                if ( target === copy ) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if ( deep && copy && ( isPlainObject( copy ) ||
                    ( copyIsArray = Array.isArray( copy ) ) ) ) {
                    src = target[ name ];

                    // Ensure proper type for the source value
                    if ( copyIsArray && !Array.isArray( src ) ) {
                        clone = [];
                    } else if ( !copyIsArray && !isPlainObject( src ) ) {
                        clone = {};
                    } else {
                        clone = src;
                    }
                    copyIsArray = false;

                    // Never move original objects, clone them
                    target[ name ] = jQueryExtend( deep, clone, copy );

                    // Don't bring in undefined values
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};