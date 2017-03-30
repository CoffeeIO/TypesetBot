TypesetBot.utils = (function(obj) {


    /**
     * Javascript implementation of Java’s String.hashCode() method.
     * **Modified**
     * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
     */
    obj.hashCode = function(str) {
        var hash = 0;
        if (str.length === 0) {
            return hash;
        }
        for (i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };

    obj.getAlignmentClass = function (alignment) {
        switch (alignment) {
            case 'justify':
                return 'typeset-justify';
            case 'ragged-right':
                return 'typeset-left';
            case 'ragged-left':
                return 'typeset-right';
            case 'ragged-center':
                return 'typeset-center';
            default:
                return '';
        }
    };

    return obj;
})(TypesetBot.utils || {});
