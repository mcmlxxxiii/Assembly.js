define(['app'], function (app) {

    function OwmWeatherState(data) {
        this.temperature = data.main.temp;
        this.minTemperature = data.main.temp_min;
        this.maxTemperature = data.main.temp_max;
        this.humidity = data.main.humidity;
        this.icons = _(data.weather).map(function (weatherGroup) {
            return [ app.settings.openWeatherMapApi.iconUrl(weatherGroup.icon),
                     weatherGroup.description ];
        });
        this.datetime = new Date(data.dt * 1000);
    }

    return OwmWeatherState;
});
