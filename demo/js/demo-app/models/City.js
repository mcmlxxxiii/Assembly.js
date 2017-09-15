pkg.privateModule('models/City', function () {
    var pkg = this;
    var app = pkg.app;

    function City(data) {
        $.extend(this, data);
        this.token = this.abbr || this.name.replace(/\W+/, '-').toLowerCase();
    }

    City.prototype.getLocation = function () {
        return this.name + ', ' + this.countryCode;
    };

    City.prototype.getLinkTo = function () {
        return app.linkTo('city', this.token);
    };

    return City;
});
