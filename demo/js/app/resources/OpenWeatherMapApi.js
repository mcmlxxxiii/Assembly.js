define(['app', 'models/OwmWeatherState'],

function (app, OwmWeatherState) {

    function getCurrentWeather(location) {
        var get = $.Deferred();
        $.ajax({
            url: app.settings.openWeatherMapApi.currentWeatherEndpoint,
            data: {
                q: location,
                units: 'imperial',
                appid: app.settings.openWeatherMapApi.authToken
            },
            dataType: 'jsonp',
            jsonp: 'callback'
            // dataFilter: function (json) {
            //     // If only this worked...
            //     return new OwmWeatherState(json);
            // }
        }).done(function (json) {
            get.resolve(new OwmWeatherState(json));
        }).fail(get.reject);;

        return get.promise();
    }

    return {
        getCurrentWeather: getCurrentWeather
    };
});
