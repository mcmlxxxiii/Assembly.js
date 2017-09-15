(function (compat) {

    var ActionHandling = {};

    ActionHandling.ActionHandlingMiddleware = {
        name: 'Assembly.ActionHandlingMiddleware',

        processRequest: function (request, proceed, respond) {
            var app = this;

            var resolved = app._router.resolvePath(request.path);
            var route = resolved.route;
            var routePathParams = resolved.routePathParams;

            if (!route) {
                throw new Error('Request path `' + request.path + '\' failed ' +
                                'to resolve!');
            }

            request.action = route.action;
            request.routeName = route.name;

            var actionParams = {};
            if (compat.isPlainObject(route.params)) {
                compat.extend(actionParams, route.params);
            }

            compat.extend(actionParams, routePathParams);

            request.actionParams = actionParams;


            var resolveCallback = function (resolvedAction) {
                request.resolvedAction = resolvedAction;
                proceed();
            };

            var resolveErrback = function (errMsg) {
                var errMsg = 'Action reference `' + request.action + ' ' +
                             'failed to resolve!';
                throw new Error(errMsg);
            };

            app.resolveActionMethod(
                    request.action, resolveCallback, resolveErrback);
        },

        processResponse: function (request, response, proceed, finish) {
            if (response.ok) {
                this.handleActionSuccess(request, response.response);
            } else {
                this.handleActionFailure(request, response.response);
            }
            proceed();
        }
    };

    Assembly.registerFeature('Action_Handling', function (
            framework, frameworkPrivate, featureConfig) {

        var Application = framework.Application;

        Application.prototype.handleActionSuccess = function () {
            throw new Error('Application#handleActionSuccess not implemented!');
        };

        Application.prototype.handleActionFailure = function () {
            throw new Error('Application#handleActionFailure not implemented!');
        };

        this.registerInitializationStep('Add_Action_Handling', function (
                app, appPrivate, appConfig, proceed, terminate) {

            this.dependsOnSteps('Add_Middleware_Engine', 'Add_Routing');

            var mwName = ActionHandling.ActionHandlingMiddleware.name;

            if (appConfig.middleware.indexOf(mwName) === -1) {
                appConfig.middleware.push(mwName);
            }

            appPrivate.middlewareEngine._mwr.makeRequest = function (
                    request, responseReady, responseFailed) {

                var action = compat.Deferred();
                request.resolvedAction.call(action, request.actionParams);
                action.done(function (response) {
                    responseReady({
                        ok: true,
                        response: response
                    });
                });
                action.fail(function (response) {
                    responseReady({
                        ok: false,
                        response: response
                    });
                });
            };

            appPrivate.middlewareEngine.registerMiddleware(
                    ActionHandling.ActionHandlingMiddleware);

            proceed();
        });
    });

})(Assembly.compat);
