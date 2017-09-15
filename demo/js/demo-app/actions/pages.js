pkg.privateModule('actions/pages', function () {
    var pkg = this;
    var app = pkg.app;

    function page(params) {
        var action = this;
        pkg.resources.PagesResource.get(params.name).done(function (page) {
            var menuSection;
            switch (params.name) {
                case 'home': menuSection = app.MenuSection.HOME; break;
                case 'links': menuSection = app.MenuSection.LINKS; break;
            }
            action.resolve({
                title: page.title,
                menuSection: menuSection,
                view: new pkg.views.SimpleView(page.html)
            });
        });
    }


    function cities() {
        var action = this;
        pkg.resources.CitiesResource.getList().done(function (cityList) {
            action.resolve({
                title: 'Cities',
                menuSection: app.MenuSection.CITIES,
                view: new pkg.views.CityListView(cityList)
            });
        });
    }


    function city(params) {
        var action = this;
        var findCity = pkg.resources.CitiesResource.findByToken(params.token);
        var getWeather = $.Deferred();

        $.when(findCity, getWeather).fail(function () {
            action.reject('Cannot load the weather data at this time. ' +
                          'Please visit later.');
        });

        findCity.done(function (city) {
            pkg.resources.OpenWeatherMapApi.getCurrentWeather(city.getLocation()).
                fail(getWeather.reject).
                done(function (owmWeatherState) {
                    getWeather.resolve(city, owmWeatherState);
                });
        });

        getWeather.done(function (city, owmWeatherState) {
            action.resolve({
                title: city.name,
                titleSecondaryText: owmWeatherState.datetime.toLocaleString(),
                menuSection: app.MenuSection.CITIES,
                view: new pkg.views.CityView(city, owmWeatherState)
            });
        });

    }


    return {
        page: page,
        cities: cities,
        city: city
    };
});
