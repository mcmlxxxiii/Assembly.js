define(['Assembly'], function (Assembly) {

    var compat = Assembly.compat;

    var ActionHandling = {};

    ActionHandling.ResolveErrorCode = {
        MODULE_NOT_LOADED: 1,
        INVALID_MODULE: 2,
        ACTION_NOT_FOUND: 3,
        ACTION_NOT_FUNCTION: 4
    };

    ActionHandling.MIDDLEWARE_NAME = 'Assembly.CoreMiddleware';

    ActionHandling.resolveAction = function (
            app, moduleName, methodName, callback, errback) {

        var load = app._load(moduleName);

        load.done(function (module) {
            var actionMethod = null;

            if (typeof module === 'function' && !methodName) {
                actionMethod = module;
            } else if (compat.isPlainObject(module) && methodName &&
                    methodName in module &&
                    typeof module[methodName] === 'function') {
                actionMethod = module[methodName];
            } else if (compat.isPlainObject(module) && methodName &&
                    !(methodName in module)) {
                errback(ActionHandling.ResolveErrorCode.ACTION_NOT_FOUND);
                return;
            } else {
                errback(ActionHandling.ResolveErrorCode.INVALID_MODULE);
                return;
            }

            if (actionMethod) {
                callback(actionMethod);
            } else {
                errback(ActionHandling.ResolveErrorCode.ACTION_NOT_FUNCTION);
            }
        });

        load.fail(function (e) {
            errback(ActionHandling.ResolveErrorCode.MODULE_NOT_LOADED, e);
        });
    };

    ActionHandling.translateActionNotation = function (action) {
        var parts = action.split('#', 2);
        return {
            actionModule: 'actions/' + parts[0],
            actionMethod: parts[1] || null
        };
    };

    ActionHandling.processRequest = function (request, proceed, respond) {
        var app = this;

        var resolved = app._router.resolvePath(request.path);
        var route = resolved.route;
        var routePathParams = resolved.routePathParams;

        if (route) {
            request.action = route.action;
            request.routeName = route.name;

            var actionParams = {};
            if (compat.isPlainObject(route.params)) {
                compat.extend(actionParams, route.params);
            }

            compat.extend(actionParams, routePathParams);

            request.actionParams = actionParams;
        } else {
            request.action = null;
        }

        if (typeof request.action !== 'string') {
            throw new Error('Invalid action in resolved route ' +
                            '`' + route.path  + '\'!');
        }

        var translated = ActionHandling.translateActionNotation(request.action);

        var resolveCallback = function (resolvedAction) {
            request.resolvedAction = resolvedAction;
            proceed();
        };

        var resolveErrback = function (errCode, originalError) {
            var errMsg;
            switch (errCode) {
                case ActionHandling.ResolveErrorCode.MODULE_NOT_LOADED:
                    errMsg = 'Module `' + translated.actionModule + '\' ' +
                             'failed to load.'
                    break;
                case ActionHandling.ResolveErrorCode.ACTION_NOT_FOUND:
                    errMsg = 'Action method ' +
                             '`' + translated.actionMethod + '\' was not ' +
                             'found in ' +
                             '`' + translated.actionModule + '\' module.';
                    break;
                case ActionHandling.ResolveErrorCode.INVALID_MODULE:
                    errMsg = 'Module `' + translated.actionModule + '\' is ' +
                             'malformed.';
                    break;
                case ActionHandling.ResolveErrorCode.ACTION_NOT_FUNCTION:
                    errMsg = 'Action `' + request.action + '\' does ' +
                             'not resolve into a function!';
                    break;
                default:
                    errMsg = 'Uknown error.';
            }

            errMsg = 'Resolving route action ' +
                     '`' + request.action + '\' failed! ' + errMsg;

            if (originalError) {
                console.error(originalError);
            }
            throw new Error(errMsg);
        };

        ActionHandling.resolveAction(this,
                                     translated.actionModule,
                                     translated.actionMethod,
                                     resolveCallback,
                                     resolveErrback);
    };

    ActionHandling.processResponse = function (
            request, response, proceed, finish) {

        if (response.ok) {
            this.handleActionSuccess(request, response.response);
        } else {
            this.handleActionFailure(request, response.response);
        }
        proceed();
    };

    ActionHandling.CoreMiddleware = {
        name: 'Assembly.CoreMiddleware',
        processRequest: ActionHandling.processRequest,
        processResponse: ActionHandling.processResponse
    };





    Assembly.registerFeature('Action_Handling__RequireJS', function (
            framework, frameworkPrivate, featureConfig) {


//        frameworkPrivate.ensureFeatures('ActionHandling',
//                ['LeveragingRequirejs', 'MiddlewareEngine', 'Routing'],
//                terminate);

        var Application = framework.Application;

        Application.prototype.handleActionSuccess = function () {
            throw new Error('Application#handleActionSuccess not implemented!');
        };

        Application.prototype.handleActionFailure = function () {
            throw new Error('Application#handleActionFailure not implemented!');
        };

        this.registerInitializationStep('Add_Action_Handling', function (
                app, appPrivate, appConfig, proceed, terminate) {

            if (appConfig.middleware.indexOf(ActionHandling.MIDDLEWARE_NAME) === -1) {
                appConfig.middleware.push(ActionHandling.MIDDLEWARE_NAME);
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

            appPrivate.middlewareEngine.registerMiddleware(ActionHandling.CoreMiddleware);

            proceed();
        });
    });
});
