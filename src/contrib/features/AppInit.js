Assembly.registerFeature('App_Init', function (
        framework, frameworkPrivate, featureConfig) {

    this.registerInitializationStep('Add_App_Init', function (
            app, appPrivate, appConfig, proceed, terminate) {

        // TODO The app._initialize method is expected to return
        // a jQuery promise. This pushes the feature/framework dependancy to the
        // app level which is not good. Figure out how this can be reworked!
        if (typeof app._initialize === 'function') {
            app._initialize.apply(app, appConfig.initArgs).
                done(proceed).
                fail(terminate);
        } else {
            proceed();
        }
    });
});
