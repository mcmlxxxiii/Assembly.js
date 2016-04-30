define([
    'app',
    'text!templates/City.html'],

function (app, tmplCity) {


    function CityView(city, weatherState) {
        var rendered = app.renderTemplate(tmplCity, {
            city: city,
            weather: weatherState
        });

        this.DOM = {
            container: $('<div></div>').html(rendered)
        }
    }

    return CityView;
});
