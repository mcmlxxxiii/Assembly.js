Assembly.registerFeature('Routing', function (
        framework, frameworkPrivate, featureConfig) {

    this.registerInitializationStep('Add_Routing', function (
            app, appPrivate, appConfig, proceed, terminate) {

        app._router = appConfig.router;

        proceed();
    });
});
