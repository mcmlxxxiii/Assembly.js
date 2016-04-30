define(['Assembly/compat',
        'Assembly/util/Router'],

function (compat,
          Router) {

    function Core_Routing(input, proceed, terminate) {
        var app = input.app;
        var priv = input.priv;
        var config = input.config;

        priv.ensureFeatures('Routing', ['LeveragingRequirejs'], terminate);


        if (!('routesModule' in config)) {
            config.routesModule = 'routes';
        }

        var router = new Router();
        window.define('router', function () { return router; });
        var require = app._makeAppRequire();
        require(['router']);

        require([config.routesModule], function () {
            router.initialize();
            app._router = router;
            priv.features.push('Routing');
            proceed();
        }, function () {
            terminate('Routes failed to load!');
        });
    };

    return Core_Routing;
});
