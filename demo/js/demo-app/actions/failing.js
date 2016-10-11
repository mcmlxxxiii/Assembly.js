pkg.privateModule('actions/failing', function () {
    return function (params) {
        this.reject('There is a problem!');
    }
});
