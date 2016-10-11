pkg.privateModule('resources/PagesResource', function () {
    var pkg = this;

    function getPage(name) {
        return $.ajax({
            url: pkg.settings.dataApi.pageRawDataUrl(name),
            data: 'text',
            dataFilter: function (rawData) {
                return pkg.models.Page.createFromRawData(rawData);
            }
        });
    };

    return {
        get: getPage
    };
});
