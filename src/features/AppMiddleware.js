define(['Assembly/compat'], function (compat) {

    function AppMiddleware(input, proceed, terminate) {
        var app = input.app;
        var priv = input.priv;
        var config = input.config;

        priv.ensureFeatures('AppMiddleware',
            ['LeveragingRequirejs', 'MiddlewareEngine'], terminate);


        var mwEngine = priv.middlewareEngine;
        var getMw = AppMiddleware.getUnknownMiddleware(
                            app, mwEngine, config.middleware);

        getMw.done(function () {
            priv.features.push('AppMiddleware');
            proceed();
        });

        getMw.fail(terminate);
    }

    AppMiddleware.getUnknownMiddleware = function (app, mwEngine, mwNames) {
        var getMw = compat.Deferred();

        var unknownMw = mwEngine.checkUnknownMiddlewareNames(mwNames);
        if (unknownMw.length) {
            var mwModules = AppMiddleware.getMiddlewareModuleNames(unknownMw);
            app._load.apply(null, mwModules).done(function () {
                for (var i = 0; i < arguments.length; i++) {
                    mwEngine.registerMiddleware(arguments[i]);
                }
                unknownMw = mwEngine.checkUnknownMiddlewareNames(mwNames);
                if (unknownMw.length == 0) {
                    getMw.resolve();
                } else {
                    getMw.reject('Failed to load middleware ' +
                                  '(' + unknownMw.toString() + ')!');
                }
            }).fail(function (error) {
                var failedModule = error.requireModules[0];
                getMw.reject('Failed to load `' + failedModule + '\'!');
            });
        } else {
            getMw.resolve();
        }

        return getMw.promise();
    };

    AppMiddleware.getMiddlewareModuleNames = function (middlewareModules) {
        var mwModules = [];
        var uniqs = {};
        for (var i = 0; i < middlewareModules.length; i++) {
            var moduleName = 'middleware/' + middlewareModules[i];
            if (uniqs[moduleName]) continue;
            uniqs[moduleName] = i;
            mwModules.push(moduleName);
        }
        return mwModules;
    };

    return AppMiddleware;
});
