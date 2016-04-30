define(function () {

    function Core_Base(input, proceed, terminate) {
        var priv = input.priv = {};
        var app = input.app;

        priv.start = [];
        app.start = function () {
            delete app.start;
            for (var i = 0, l = priv.start.length; i < l; i++) {
                priv.start[i].call(app);
            }
        };

        priv.features = [];
        priv.ensureFeatures = function (featureName, deps, terminate) {
            var depsNotMet = [];
            for (var i = 0, l = deps.length; i < l; i++) {
                var depFeature = deps[i];
                if (priv.features.indexOf(depFeature) === -1) {
                    depsNotMet.push(depFeature);
                }
            }
            if (depsNotMet.length) {
                terminate('Feature `' + featureName + '\' cannot be added ' +
                          'as its dependency feature(s) ' +
                          '`' + depsNotMet.join('\', `') + '\' ' +
                          'are not yet added!');
            }
        };

        proceed();
    };

    return Core_Base;
});
