pkg.privateModule('views/CityView', function () {
    var pkg = this;
    var app = pkg.app;

    function CityView(city, weatherState) {
        var rendered = app.renderTemplate('tmplCity', {
            city: city,
            weather: weatherState
        });

        this.DOM = {
            container: $('<div></div>').html(rendered)
        }
    }

    return CityView;
});
