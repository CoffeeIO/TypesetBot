TypesetBot.utils = (function(obj) {


    /**
     * Javascript implementation of Java’s String.hashCode() method.
     * **Modified**
     * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
     */
    obj.getHash = function(str) {
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

    /**
     * Get the css relevant to the alignment given.
     */
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

    /**
     * Take a string array and return array of string length and ignore last element.
     * Fx: ["hyp", "hen", "ation"] --> [3, 3].
     */
    obj.getArrayIndexes = function (arr) {
        var indexes = [];

        for (var i = 0; i < arr.length - 1; i++) {
            indexes.push(arr[i].length);
        }

        return indexes;
    };

    /**
     * Take an array of begin tags, reverse them and create their closing tags.
     * Fx: ['<span class="test">', '<b>'] --> ['</b>','</span>'].
     */
    obj.reverseStack = function (nodes, nodeIndexes) {
        var arr = [];
        nodeIndexes.forEach(function (nodeIndex) {
            var node = nodes[nodeIndex];
            arr.push(node.str);
        });

        var newArr = [],
            tagNameRegex = /<(\w*)/;
        // Create a copy of array to not reverse reference array.
        [].concat(arr).reverse().forEach(function (elem) {
            var res = elem.match(tagNameRegex);
            newArr.push('</' + res[1] + '>');
        });
        return newArr;
    };

    /**
     * Merge two json objects.
     * @param o1 The default json, base
     * @param o2 The custom json, overwrite existing elements
     */
    obj.jsonConcat = function (o1, o2) {
        for (var key in o2) {
            if ({}.hasOwnProperty.call(o2, key)) {
                o1[key] = o2[key];
            }
        }
        return o1;
    };

    return obj;
})(TypesetBot.utils || {});
