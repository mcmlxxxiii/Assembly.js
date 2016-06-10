define(['Assembly', 'Assembly/contrib/utils/Router'], function (Assembly, Router) {

    Assembly.registerFeature('Routing__RequireJS', function (
            framework, frameworkPrivate, featureConfig) {

        this.registerInitializationStep('Add_Routing', function (
                app, appPrivate, appConfig, proceed, terminate) {

            this.dependsOn('Leverage_RequireJS');


            if (!('routesModule' in appConfig)) {
                appConfig.routesModule = 'routes';
            }

            var router = new Router();
            window.define('router', function () { return router; });
            var require = app._makeAppRequire();
            require(['router']);

            require([appConfig.routesModule], function () {
                router.initialize();
                app._router = router;
                proceed();
            }, function () {
                terminate('Routes failed to load!');
            });
        });
    });
});
