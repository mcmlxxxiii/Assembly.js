define(['jquery'],  function ($) {

    return {
        Deferred: $.Deferred,
        when: $.when,
        extend: $.extend,
        isPlainObject: $.isPlainObject,
        trim: $.trim,
        liveBind: function (target, eventName, selector, handler) {
            $(target).on(eventName, selector, handler);
        }
    };
});
