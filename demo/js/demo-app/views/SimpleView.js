pkg.privateModule('views/SimpleView', function () {

    function SimpleView(html) {
        this.DOM = {
            container: $('<div></div>').html(html)
        };
    }

    return SimpleView;
});
