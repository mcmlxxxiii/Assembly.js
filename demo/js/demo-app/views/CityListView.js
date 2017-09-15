pkg.privateModule('views/CityListView', function () {
    var pkg = this;
    var app = pkg.app;

    function CityListView(cityList) {
        var rendered = app.renderTemplate('tmplCityList', {
            cityList: cityList
        });

        this.DOM = {
            container: $('<div></div>').html(rendered)
        }
    }

    return CityListView;
});
