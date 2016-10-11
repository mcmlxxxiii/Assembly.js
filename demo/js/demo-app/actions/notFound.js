pkg.privateModule('actions/notFound', function () {
    var pkg = this;

    return function (params) {
        this.resolve({
            title: 'Not Found!',
            view: new pkg.views.SimpleView('Technically, this view is a result of the action associated with the last route defined, the catch-all one.')
        });
    }
});
