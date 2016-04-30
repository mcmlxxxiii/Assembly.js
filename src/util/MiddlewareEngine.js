define(['Assembly/compat',
        'Assembly/util/MiddlewareRunner'],

function (compat,
          MiddlewareRunner) {


    function MiddlewareEngine() {
        this._running = false;
        this._mwRegistry = {};
        this._mwr = new MiddlewareRunner();
    }

    MiddlewareEngine.prototype.registerMiddleware = function (mw) {
        if (this._running) {
            throw new Error('Cannot register middleware as the engine ' +
                            'is already running!');
        }

        if (!compat.isPlainObject(mw)) {
            throw new Error('Invalid middleware (not an object)!');
        }

        if (typeof mw.name !== 'string' || !mw.name.length) {
            throw new Error('Invalid middleware ' +
                            '(should have a non-empty string name)!');
        }

        this._mwRegistry[mw.name] = mw;
    };


    MiddlewareEngine.prototype.start = function (mwContext, mwOrder) {
        if (!(mwOrder instanceof Array)) {
            throw new Error('Can not start middleware engine ' +
                            '(bad middleware order provided)!');
        }

        this._running = true;

        var mwObjects = MiddlewareEngine.getMiddlewareObjects(
                                this._mwRegistry, mwOrder);
        this._mwr.setUp(mwObjects, mwContext);
    };

    MiddlewareEngine.prototype.checkUnknownMiddlewareNames = function (
            mwNames) {

        var unknownMwNames = [];

        for (var i = 0; i < mwNames.length; i++) {
            var mwName = mwNames[i];
            if (mwName in this._mwRegistry) continue;
            unknownMwNames.push(mwName);
        }

        return unknownMwNames;
    };

    MiddlewareEngine.getMiddlewareObjects = function (mwRegistry, mwOrder) {
        var mwObjects = [];
        for (var i = 0, l = mwOrder.length; i < l; i++) {
            var mwName = mwOrder[i];
            mwObjects.push(mwRegistry[mwName]);
        }
        return mwObjects;
    };


    return MiddlewareEngine;
});

