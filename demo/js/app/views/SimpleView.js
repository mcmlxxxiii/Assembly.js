define([ 'app'], function (app) {

    function SimpleView(html) {
        this.DOM = {
            container: $('<div></div>').html(html)
        };
    }

    return SimpleView;
});
