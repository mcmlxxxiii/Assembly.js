define(['views/SimpleView'],

function (SimpleView) {

    return function notFound(params) {
        this.resolve({
            title: 'Not Found!',
            view: new SimpleView('Technically, this view is a result of the action associated with the last route defined, the catch-all one.')
        });
    }
});
