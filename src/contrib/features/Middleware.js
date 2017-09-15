Assembly.registerFeature('Middleware', function (
        framework, frameworkPrivate, featureConfig) {

    this.registerInitializationStep('Add_Middleware_Engine', function (
            app, appPrivate, appConfig, proceed, terminate) {

        if (!('middleware' in appConfig) ||
                !(appConfig.middleware instanceof Array)) {

            appConfig.middleware = [];
        };

        appPrivate.middlewareEngine = new MiddlewareEngine();

        proceed();

    });

    this.registerInitializationStep('Start_Middleware_Engine', function (
            app, appPrivate, appConfig, proceed, terminate) {

        this.dependsOnStep('Add_Middleware_Engine');

        appPrivate.middlewareEngine.start(app, appConfig.middleware);

        proceed();
    });
});
