define([
    'Assembly/compat',
    'Assembly/util/StaircaseProcess',
    'Assembly/features/core/Base',
    'Assembly/features/core/LeveragingRequirejs',
    'Assembly/features/core/Middleware',
    'Assembly/features/core/Routing',
    'Assembly/features/core/Navigation',
    'Assembly/features/core/ActionHandling',
    'Assembly/features/core/RequestHandling',
    //'Assembly/features/I18n',
    'Assembly/features/Settings',
    //'Assembly/features/AppMiddleware',
    'Assembly/features/AppInit'],

function (
    compat,
    StaircaseProcess,
    Core_Base,
    Core_LeveragingRequirejs,
    Core_Middleware,
    Core_Routing,
    Core_Navigation,
    Core_ActionHandling,
    Core_RequestHandling,
    //I18n,
    Settings,
    //AppMiddleware,
    AppInit) {


    function Application(name, config) {
        Application.ensureConstructorCall(this, arguments);
        Application.ensureValidArguments(arguments);

        var app = this;

        app.container = window.document.createElement('div');

        config = compat.extend(true, {}, config);
        config.name = name;

        app.bootstrap = function () {
            delete app.bootstrap;

            var ready = compat.Deferred();

            config.initArgs = Array.prototype.slice.call(arguments);

            var addFeatures = new StaircaseProcess(
                  'Assembly: Adding application features');

            addFeatures.step(10, Core_Base);
            addFeatures.step(10, Core_LeveragingRequirejs);
            addFeatures.step(20, Core_Middleware);
            addFeatures.step(20, Core_Routing);
            addFeatures.step(20, Core_RequestHandling);
            addFeatures.step(20, Settings);
            //addFeatures.step(20, I18n);
            addFeatures.step(30, Core_Navigation);
            addFeatures.step(30, Core_ActionHandling);
            addFeatures.step(40, AppInit);
            //addFeatures.step(40, AppMiddleware);
            addFeatures.step(50, Core_Middleware.start);

            var prepare = addFeatures.run({ app: app, config: config });

            prepare.done(function () {
                app.start();
                ready.resolve(app.container);
            });

            return ready.promise();
        };
    }

    Application.ensureConstructorCall = function (that, args) {
        if (that.constructor !== args.callee) {
            throw new Error('Application should be called as constructor ' +
                            '(with keyword `new\')!');
        }
    };

    Application.ensureValidArguments = function (args) {
        if ((args.length !== 2) ||
                (typeof args[0] !== 'string') ||
                (!compat.isPlainObject(args[1]))) {
            throw new Error(
                'Application misconfigured! It expects strictly 2 arguments: ' +
                'a string app name (the same as requirejs package name), ' +
                'and an app configuration object.');
        }
    };

    return Application;
});
