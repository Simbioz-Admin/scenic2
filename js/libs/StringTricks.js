/*
* StringTricks
* Perform some thrick on strings.
*/
define (function () {
    return {
        /****
         * mask
         * replace the middle of a string by an elipsis reaviling only a few 
         * characters at the beginning or the end.
         * @param {String} a string to be elipsed
         * @param {Int} (optional) number of characters to reveal in the beginning, default 4
         * @param {Int} (optional ) number of characters to reveal at the end, default 4
         * @return {String}
         * 
         ****/
        mask: function mask(str, beginning, end) {
            var strLen = str.length;
            var beginning = beginning || 4;
            var end = end || 4;
            if (strLen <= beginning || strLen <= end ) {
                return str;
            } else {
                // get the opening characters
                var opening = str.substring(0, beginning);
                console.log("opening " + opening)
                // get the closing characters
                var closing = str.substring(str.length - end, str.length);
                console.log("closing " + closing);
                var ret = opening + "..." + closing;
                console.log("returns " + ret);
                return ret
            }
        }
    };
});

