define(['app'], function (app) {

    return {
        openWeatherMapApi: {
            authToken: 'a0f59c46ecf2bc85c76a612cd56013d5',
            currentWeatherEndpoint: 'http://api.openweathermap.org/data/2.5/weather',
            iconUrl: function (iconCode) {
                return 'http://openweathermap.org/img/w/' + iconCode + '.png';
            }
        },
        dataApi: {
            citiesJsonUrl: app._packagePath + '/data/cities.json',
            pageRawDataUrl: function (pageName) {
                return app._packagePath + '/data/pages/' + pageName + '.page';
            }
        }
    };
});
