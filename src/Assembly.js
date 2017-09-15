var Assembly = (function (compat) {

    var Assembly = {};

    Object.defineProperty(Assembly, 'compat', {
        get: function () { return compat; }
    });

    Assembly.createFramework = function (frameworkInstructionsFn) {

        var framework = {};
        var frameworkPrivate = {};

        frameworkPrivate.features = [];

        var frameworkWorker = {
            useFeature: function (featureName, featureConfig) {
                frameworkPrivate.features.push({
                    name: featureName,
                    config: featureConfig
                });
            },
            describeAppInitializeProcess: function (processConfig) {
                frameworkPrivate.appInitializeProcessConfig = processConfig;
            }
        };

        frameworkInstructionsFn.apply(frameworkWorker);

        if (typeof frameworkPrivate.appInitializeProcessConfig !== 'function') {
            throw new Error('`describeAppInitializeProcess\' part is missing ' +
                            'from the framework configuration.');
        }

        frameworkPrivate.featureInitializationSteps = {};
        var featureWorker = {
            registerInitializationStep: function (name, fn) {
                // TODO Check for overwrites.
                frameworkPrivate.featureInitializationSteps[name] = fn;
            }
        };

        for (var i = 0, l  = frameworkPrivate.features.length; i < l; i++) {
            var feature = frameworkPrivate.features[i];
            var featureFn = Assembly._featureRegistry[feature.name];
            // TODO Check if the feature is registered!
            featureFn.call(
                featureWorker, framework, frameworkPrivate, feature.config);
        }

        return framework;
    };

    Assembly._featureRegistry = {};

    Assembly.registerFeature = function (name, instructionsFn) {
        if (typeof name !== 'string' || typeof instructionsFn !== 'function') {
            throw new Error('Failure (invalid name or instructions) to ' +
                            'register feature `' + name.toString() + '\'!');
        }
        if (Assembly._featureRegistry[name]) {
            throw new Error('Feature `' + name + '\' is already registered!');
        }
        Assembly._featureRegistry[name] = instructionsFn;
    };

    Assembly.ensureConstructorCall = function (that, args) {
        if (that.constructor !== args.callee) {
            throw new Error('Application should be called as constructor ' +
                            '(with keyword `new\')!');
        }
    };

    Assembly.registerFeature('Core', function (
            framework, frameworkPrivate, featureConfig) {

        framework.util = {};

        function Application(config) {
            Assembly.ensureConstructorCall(this, arguments);

            var app = this;

            app.container = window.document.createElement(featureConfig.containerElement || 'DIV');

            var configCopy = Assembly.compat.extend(true, {}, config);

            app.bootstrap = function () {
                delete app.bootstrap;

                configCopy.initArgs = Array.prototype.slice.call(arguments);

                var ready = Assembly.compat.Deferred();

                var process = new MultiLevelProcess('Application initialization');

                frameworkPrivate.appInitializeProcessConfig.call({
                    step: function (level, stepName) {
                        var step = frameworkPrivate.featureInitializationSteps[stepName];

                        if (typeof step !== 'function') {
                            throw new Error('Step `' + stepName + '\' is not ' +
                                            'found in any of the registered ' +
                                            'features.');
                        }

                        var stepFn = function (input, proceed, terminate) {
                            var context = {
                                dependsOnSteps: function () {
                                    var depSteps = Array.prototype.slice.call(arguments);
                                    input.appPrivate.ensurePriorSteps(stepName, depSteps, terminate);
                                },
                                dependsOnStep: function () {
                                    this.dependsOnSteps(arguments[0]);
                                }
                            };
                            var decoratedProceed = function () {
                                proceed();
                                input.appPrivate.initializeStepsFinished.push(stepName);
                            };
                            if (stepName !== 'Add_Base') {
                                context.dependsOnStep('Add_Base');
                            }
                            step.call(context, input.app, input.appPrivate, input.appConfig, decoratedProceed, terminate);
                        };

                        process.step(level, stepFn, stepName);
                    }
                });

                var appPrivate = {
                    initializeStepsFinished: [],
                    ensurePriorSteps: function (stepName, deps, terminate) {
                        var depsNotMet = [];
                        for (var i = 0, l = deps.length; i < l; i++) {
                            var depStep = deps[i];
                            if (appPrivate.initializeStepsFinished.indexOf(depStep) === -1) {
                                depsNotMet.push(depStep);
                            }
                        }
                        if (depsNotMet.length) {
                            terminate('Step `' + stepName + '\' cannot be processed ' +
                                      'as its dependency step(s) ' +
                                      '`' + depsNotMet.join('\', `') + '\' ' +
                                      'are not yet processed!');
                        }
                    }
                };

                var input = {
                    app: app,
                    appPrivate: appPrivate,
                    appConfig: configCopy
                };

                var initialize = process.run(input);

                initialize.done(function () {
                    app._start();
                    ready.resolve(app.container);
                });

                return ready.promise();
            };
        }

        framework.Application = Application;


        this.registerInitializationStep('Add_Base', function (
                app, appPrivate, appConfig, proceed, terminate) {

            appPrivate.start = [];
            app._start = function () {
                delete app._start;
                for (var i = 0, l = appPrivate.start.length; i < l; i++) {
                    appPrivate.start[i].call(app);
                }
                delete appPrivate.start;
            };

            proceed();
        });
    });

    return Assembly;

})(Assembly_Compat);
