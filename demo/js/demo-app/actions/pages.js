define([
    'app',
    'resources/OpenWeatherMapApi',
    'resources/CitiesResource',
    'resources/PagesResource',
    'views/SimpleView',
    'views/CityView',
    'views/CityListView'],

function (
    app,
    OpenWeatherMapApi,
    CitiesResource,
    PagesResource,
    SimpleView,
    CityView,
    CityListView) {



    function page(params) {
        var action = this;
        PagesResource.get(params.name).done(function (page) {
            var menuSection;
            switch (params.name) {
                case 'home': menuSection = app.MenuSection.HOME; break;
                case 'links': menuSection = app.MenuSection.LINKS; break;
            }
            action.resolve({
                title: page.title,
                menuSection: menuSection,
                view: new SimpleView(page.html)
            });
        });
    }


    function cities() {
        var action = this;
        CitiesResource.getList().done(function (cityList) {
            action.resolve({
                title: 'Cities',
                menuSection: app.MenuSection.CITIES,
                view: new CityListView(cityList)
            });
        });
    }


    function city(params) {
        var action = this;
        var findCity = CitiesResource.findByToken(params.token);
        var getWeather = $.Deferred();

        $.when(findCity, getWeather).fail(function () {
            action.reject('Cannot load the weather data at this time. ' +
                          'Please visit later.');
        });

        findCity.done(function (city) {
            OpenWeatherMapApi.getCurrentWeather(city.getLocation()).
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
                view: new CityView(city, owmWeatherState)
            });
        });

    }


    return {
        page: page,
        cities: cities,
        city: city
    };
});
