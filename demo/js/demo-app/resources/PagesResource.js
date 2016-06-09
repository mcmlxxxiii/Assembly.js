define(['app', 'models/Page'],

function (app, Page) {

    function getPage(name) {
        return $.ajax({
            url: app.settings.dataApi.pageRawDataUrl(name),
            data: 'text',
            dataFilter: function (rawData) {
                return Page.createFromRawData(rawData);
            }
        });
    };

    return {
        get: getPage
    };
});

