define(['Assembly/compat'], function (compat) {

    function getValueFromNestedObject(obj, path) {
        if (!compat.isPlainObject(obj)) return;
        if (typeof path !== 'string') return obj;
        var value = obj;
        var parts = path.split('.');
        while (parts.length) {
            var p = parts.shift();
            if (p.length === 0) continue;
            value = value[p];
            if (value === undefined) return;
        }
        return value;
    }

    function objectHasValue(obj, value) {
        for (var key in obj) {
            if (obj[key] === value) return key;
        }
    }

    return {
        getValueFromNestedObject: getValueFromNestedObject,
        objectHasValue: objectHasValue
    };

});
