Assembly.registerFeature('Request_Handling', function (
        framework, frameworkPrivate, featureConfig) {

    var compat = Assembly.compat;

    this.registerInitializationStep('Add_Request_Handling', function (
            app, appPrivate, appConfig, proceed, terminate) {

        this.dependsOnStep('Add_Middleware_Engine');

        app._handleRequest = function (request) {
            var finish = compat.Deferred();
            appPrivate.middlewareEngine._mwr.handleRequest(request, function (
                    response) {

                if (response.ok) {
                    finish.resolve();
                } else {
                    finish.reject();
                }
            });
            return finish.promise();
        };

        proceed();
    });
});
