define(['Assembly/compat'], function (compat) {

    function Core_LeveragingRequirejs(input, proceed, terminate) {
        var app = input.app;
        var priv = input.priv;
        var config = input.config;


        var globalConfig = Core_LeveragingRequirejs.getGlobalRequireConfig();

        if (!('baseUrl' in globalConfig)) {
            terminate('Mandatory `baseUrl\' parameter is missing ' +
                      'in the global requirejs configuration!');
            return;
        }

        if (!('name' in config)) {
            terminate('Mandatory `name\' parameter ' +
                      'is missing in the configuration!');
            return;
        }

        if (config.requireConfig &&
                !compat.isPlainObject(config.requireConfig)) {

            terminate('Invalid configuration part for `requireConfig\' ' +
                      '(not a plain object)!');
            return;
        }

        if (config.requireReuseGlobalPaths &&
                !(config.requireReuseGlobalPaths instanceof Array)) {
            terminate('Invalid configuration part for ' +
                      '`require.requireReuseGlobalPaths\' ' +
                      '(not an array)!');
            return;
        }

        var pkg;
        for (var i = 0, l = globalConfig.packages.length; i < l; i++) {
            if (typeof globalConfig.packages[i] === 'string' &&
                    globalConfig.packages[i] == config.name) {

                pkg = { name: globalConfig.packages[i] };
                break;
            } else if (compat.isPlainObject(globalConfig.packages[i]) &&
                    globalConfig.packages[i].name == config.name) {

                pkg = globalConfig.packages[i];
                break;
            }
        }

        if (!pkg) {
            terminate('Application package `' + config.name + '\' ' +
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
                if (config.requireReuseGlobalPaths.indexOf(path) >= 0) {
                    reusedPaths[path] =
                            globalConfig.baseUrl + globalConfig.paths[path];
                }
            }
        }

        var appContextRequireConfig = compat.extend(true, {},
                config.requireConfig, {
                    baseUrl: app._packagePath,
                    context: Math.random() * 1000 + '',
                    paths: reusedPaths
                });

        app._makeAppRequire = function () {
            return window.require.config(appContextRequireConfig);
        };

        app._require = (function (app) {
            var require = app._makeAppRequire();
            if (!!config.defineAppMediator) {
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

        priv.features.push('LeveragingRequirejs');
        proceed();
    };

    Core_LeveragingRequirejs.getGlobalRequireConfig = function () {
        return window.requirejs.s.contexts._.config;
    };

    return Core_LeveragingRequirejs;
});
