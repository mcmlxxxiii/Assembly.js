var MiddlewareRunner = (function (compat) {

    function MiddlewareRunner() {
        this._middlewareContext;
        this._processRequestMiddlewareChain = [];
        this._processResponseMiddlewareChain = [];
    }

    MiddlewareRunner.prototype.setUp = function (
        middlewareObjects, middlewareContext) {

        this._middlewareContext = middlewareContext;

        this._processRequestMiddlewareChain =
            MiddlewareRunner.makeProcessRequestMiddlewareChain(
                middlewareObjects);

        this._processResponseMiddlewareChain =
            MiddlewareRunner.makeProcessResponseMiddlewareChain(
                middlewareObjects);
    }

    MiddlewareRunner.makeProcessRequestMiddlewareChain = function (mwObjects) {
        var chain = [];

        for (var i = 0, l = mwObjects.length; i < l; i++) {
            var mw = mwObjects[i];
            var mwMethod = mw.processRequest;
            if (mwMethod) {
                chain.push(mwMethod);
            }
        };

        return chain;
    };

    MiddlewareRunner.makeProcessResponseMiddlewareChain = function (mwObjects) {
        var chain = [];

        for (var i = mwObjects.length - 1; i >= 0; i--) {
            var mw = mwObjects[i];
            var mwMethod = mw.processResponse;
            if (mwMethod) {
                chain.push(mwMethod);
            }
        };

        return chain;
    };


    MiddlewareRunner.prototype.handleRequest = function (request, callback) {
        var mwr = this;

        if (!compat.isPlainObject(request)) {
            throw new Error('Invalid request (not an object)!');
        }

        function processResponse(response) {
            mwr._runProcessResponseMiddlewareChain(request, response, callback);
        }

        var requestReadyCallback = function (request) {
            mwr.makeRequest(request, processResponse);
        };

        mwr._runProcessRequestMiddlewareChain(
            request, requestReadyCallback, processResponse);
    };

    MiddlewareRunner.prototype._runProcessRequestMiddlewareChain = function (
            request, requestReadyCallback, responseReceivedCallback) {

        var mwr = this;
        var currentMwIdx = 0;

        function proceed() {
            var mwMethod = mwr._processRequestMiddlewareChain[currentMwIdx++];
            if (mwMethod) {
                mwMethod.call(mwr._middlewareContext,
                              request,
                              proceed,
                              responseReceivedCallback);
            } else {
                requestReadyCallback(request);
            }
        }

        proceed();
    };

    MiddlewareRunner.prototype._runProcessResponseMiddlewareChain = function (
            request, response, doneCallback) {

        var mwr = this;
        var currentMwIdx = 0;
        var goOn = true;

        function finish() {
            goOn = false;
            doneCallback && doneCallback(response);
        }

        function proceed() {
            var mwMethod = mwr._processResponseMiddlewareChain[currentMwIdx++];
            if (goOn && mwMethod) {
                mwMethod.call(mwr._middlewareContext,
                              request,
                              response,
                              proceed,
                              finish);
            } else {
                finish();
            }
        }

        proceed();
    };

    return MiddlewareRunner;

})(Assembly_Compat);
