define(['Assembly'], function (Assembly) {

    Assembly.registerFeature('Leveraging_RequireJS', function (
            framework, frameworkPrivate, featureConfig) {

        var compat = Assembly.compat;

        frameworkPrivate.getGlobalRequireConfig = function () {
            return window.requirejs.s.contexts._.config;
        };

        this.registerInitializationStep('Leverage_RequireJS', function (
                app, appPrivate, appConfig, proceed, terminate) {

            var globalConfig = frameworkPrivate.getGlobalRequireConfig();

            if (!('baseUrl' in globalConfig)) {
                terminate('Mandatory `baseUrl\' parameter is missing ' +
                          'in the global requirejs configuration!');
                return;
            }

            if (!('name' in appConfig)) {
                terminate('Mandatory `name\' parameter ' +
                          'is missing in the configuration!');
                return;
            }

            if (appConfig.requireConfig &&
                    !compat.isPlainObject(appConfig.requireConfig)) {

                terminate('Invalid configuration part for `requireConfig\' ' +
                          '(not a plain object)!');
                return;
            }

            if (appConfig.requireReuseGlobalPaths &&
                    !(appConfig.requireReuseGlobalPaths instanceof Array)) {
                terminate('Invalid configuration part for ' +
                          '`require.requireReuseGlobalPaths\' ' +
                          '(not an array)!');
                return;
            }

            var pkg;
            for (var i = 0, l = globalConfig.packages.length; i < l; i++) {
                if (typeof globalConfig.packages[i] === 'string' &&
                        globalConfig.packages[i] == appConfig.name) {

                    pkg = { name: globalConfig.packages[i] };
                    break;
                } else if (compat.isPlainObject(globalConfig.packages[i]) &&
                        globalConfig.packages[i].name == appConfig.name) {

                    pkg = globalConfig.packages[i];
                    break;
                }
            }

            if (!pkg) {
                terminate('Application package `' + appConfig.name + '\' ' +
                          '(refer to the app name) is not found in the global ' +
                          'requirejs configuration!');
                return;
            }

            var packagePath = pkg.location || pkg.name;
            packagePath = globalConfig.baseUrl + '/' + packagePath;
            packagePath = packagePath.replace('//', '/');
            packagePath = packagePath.replace('/./', '/');
            app._packagePath = packagePath;

            var reusedPaths = {};
            if (compat.isPlainObject(globalConfig.paths)) {
                for (var path in globalConfig.paths) {
                    if (appConfig.requireReuseGlobalPaths.indexOf(path) >= 0) {
                        reusedPaths[path] =
                                globalConfig.baseUrl + globalConfig.paths[path];
                    }
                }
            }

            var appContextRequireConfig = compat.extend(true, {},
                    appConfig.requireConfig, {
                        baseUrl: app._packagePath,
                        context: Math.random() * 1000 + '',
                        paths: reusedPaths
                    });

            app._makeAppRequire = function () {
                return window.require.config(appContextRequireConfig);
            };

            app._require = (function (app) {
                var require = app._makeAppRequire();
                if (!!appConfig.defineAppMediator) {
                    define('app', function () { return app; });
                    require(['app']);
                }
                return require;
            })(app);

            // Because app._require is shooting its errback for each module that
            // fails, a method that would not do so is needed.
            app._load = function () {
                var moduleNames = Array.prototype.slice.call(arguments);
                var load = compat.Deferred();
                app._require.call(null, moduleNames, function () {
                    var modules = Array.prototype.slice.call(arguments);
                    load.resolve.apply(null, modules);
                }, load.reject);
                return load.promise();
            };

            proceed();
        });
    });
});
