define(function () {

    return function failing(params) {
        this.reject('There is a problem!');
    }
});
