pkg.privateModule('settings', function () {

    var rootPath = window.location.pathname.substr(
            0, window.location.pathname.lastIndexOf('/'));

    var packagePath = rootPath + '/js/demo-app';

    return {
        openWeatherMapApi: {
            authToken: 'a0f59c46ecf2bc85c76a612cd56013d5',
            currentWeatherEndpoint: 'https://api.openweathermap.org/data/2.5/weather',
            iconUrl: function (iconCode) {
                return 'https://openweathermap.org/img/w/' + iconCode + '.png';
            }
        },
        dataApi: {
            citiesJsonUrl: packagePath + '/data/cities.json',
            pageRawDataUrl: function (pageName) {
                return packagePath + '/data/pages/' + pageName + '.page';
            }
        }
    };
});
