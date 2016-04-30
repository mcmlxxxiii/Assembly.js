define(['Assembly/util/MiddlewareEngine'],

function (MiddlewareEngine) {

    function Core_MiddlewareEngine(input, proceed, terminate) {
        var app = input.app;
        var priv = input.priv;
        var config = input.config;

        if (!('middleware' in config)) {
            config.middleware = [];
        };

        priv.middlewareEngine = new MiddlewareEngine();

        // Adding MiddlewareEngine initialization as the last step in the
        // process. If this middleware is known (already configured),
        // this adjustment will not occur.
        if (this._knownSteps.indexOf(Core_MiddlewareEngine.start) === -1) {
            this.step(this._stepsByStage.length, Core_MiddlewareEngine.start);
        }

        priv.features.push('MiddlewareEngine');
        proceed();
    };

    Core_MiddlewareEngine.start = function Core_MiddlewareEngine_Start(
            input, proceed, terminate) {

        var app = input.app;
        var priv = input.priv;
        var config = input.config;

        priv.ensureFeatures('MiddlewareEngine.start',
                ['MiddlewareEngine'], terminate);

        priv.middlewareEngine.start(app, config.middleware);

        priv.features.push('MiddlewareEngine.start');
        proceed();
    };

    return Core_MiddlewareEngine;
});
