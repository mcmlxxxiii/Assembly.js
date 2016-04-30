define([
    'app',
    'text!templates/CityList.html'],

function (app, tmplCityList) {


    function CityListView(cityList) {
        var rendered = app.renderTemplate(tmplCityList, {
            cityList: cityList
        });

        this.DOM = {
            container: $('<div></div>').html(rendered)
        }
    }

    return CityListView;
});
