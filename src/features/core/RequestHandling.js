define(['Assembly/compat'], function (compat) {

    function Core_RequestHandling(input, proceed, terminate) {
        var app = input.app;
        var priv = input.priv;

        priv.ensureFeatures('RequestHandling', ['MiddlewareEngine'], terminate);

        app._handleRequest = function (request) {
            var finish = compat.Deferred();
            priv.middlewareEngine._mwr.handleRequest(request, function (
                    response) {

                if (response.ok) {
                    finish.resolve();
                } else {
                    finish.reject();
                }
            });
            return finish.promise();
        };

        priv.features.push('RequestHandling');
        proceed();
    }

    return Core_RequestHandling;
});
