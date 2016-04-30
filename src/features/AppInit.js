define(['Assembly/compat'], function (compat) {

    function AppInit(input, proceed, terminate) {
        var app = input.app;
        var priv = input.priv;
        var config = input.config;

        if (typeof app._initialize === 'function') {
            var init = app._initialize.apply(app, config.initArgs);
            init.done(function () {
                priv.features.push('AppInit');
                proceed();
            });
            init.fail(terminate);
        } else {
            priv.features.push('AppInit');
            proceed();
        }
    };

    return AppInit;
});
