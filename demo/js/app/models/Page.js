define(['app'], function (app) {

    function Page(data) {
        $.extend(this, data);
    }

    Page.createFromRawData = function (rawData) {
        var title = $.trim(rawData.substr(0, rawData.indexOf('\n')));
        var html = $.trim(rawData.substr(rawData.indexOf('\n')));
        return new Page({
            title: title,
            html: html
        });
    };

    return Page;
});
