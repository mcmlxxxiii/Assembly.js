define(['app', 'models/City'],

function (app, City) {

    var cachedList = null;

    function getList() {
        var get = $.Deferred();

        if (cachedList) {
            get.resolve(cachedList);
        } else {
            $.ajax({
                url: app.settings.dataApi.citiesJsonUrl
            }).done(function (json) {
                cachedList = _(json).map(function (data) {
                    return new City(data);
                });
                get.resolve(cachedList);
            }).fail(get.reject);
        }

        return get.promise();
    };

    function findByToken(token) {
        var find = $.Deferred();

        getList().done(function (cityList) {
            var found = _(cityList).find(function (city) {
                return city.token == token;
            });

            if (found) {
                find.resolve(found);
            } else {
                find.reject();
            }
        }).fail(find.reject);;

        return find.promise();
    };

    return {
        getList: getList,
        findByToken: findByToken
    };
});

