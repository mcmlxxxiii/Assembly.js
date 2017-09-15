pkg.privateModule('resources/OpenWeatherMapApi', function () {
    var pkg = this;

    function getCurrentWeather(location) {
        var get = $.Deferred();
        $.ajax({
            url: pkg.settings.openWeatherMapApi.currentWeatherEndpoint,
            data: {
                q: location,
                units: 'imperial',
                appid: pkg.settings.openWeatherMapApi.authToken
            },
            dataType: 'jsonp',
            jsonp: 'callback'
            // dataFilter: function (json) {
            //     // If only this worked...
            //     return new pkg.models.OwmWeatherState(json);
            // }
        }).done(function (json) {
            get.resolve(new pkg.models.OwmWeatherState(json));
        }).fail(get.reject);;

        return get.promise();
    }

    return {
        getCurrentWeather: getCurrentWeather
    };
});
