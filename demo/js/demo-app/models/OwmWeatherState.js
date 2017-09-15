pkg.privateModule('models/OwmWeatherState', function () {
    var pkg = this;

    function OwmWeatherState(data) {
        this.temperature = data.main.temp;
        this.minTemperature = data.main.temp_min;
        this.maxTemperature = data.main.temp_max;
        this.humidity = data.main.humidity;
        this.icons = _(data.weather).map(function (weatherGroup) {
            return [ pkg.settings.openWeatherMapApi.iconUrl(weatherGroup.icon),
                     weatherGroup.description ];
        });
        this.datetime = new Date(data.dt * 1000);
    }

    return OwmWeatherState;
});
