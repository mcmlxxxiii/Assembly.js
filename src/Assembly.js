var Assembly = (function (compat) {

    var Assembly = {};

    Object.defineProperty(Assembly, 'compat', {
        get: function () { return compat; }
    });


    var StaircaseProcess = (function (compat) {

        function StaircaseProcess(name) {
            this._name = name;
            this._stepsByLevel = [];
            this._knownSteps = [];
        }

        StaircaseProcess.runLevel = function (input, levelNum, steps) {
            var promises = [];

            for (var i = 0; i < steps.length; i++) {
                var run = compat.Deferred();
                var stepName = steps[i].name;

                run.done((function (msg) { return function () {
                    console.debug(msg);
                }})('Step ' + levelNum +
                    '/' + i + ' ' + (stepName ? stepName + ' ' : '') +
                    'done.'));

                run.fail((function (m1) { return function (m2) {
                    console.error(m2);
                    console.error(m1);
                }})('Step ' + levelNum +
                    '/' + i + ' ' + (stepName || '') + ' failed!'));

                promises.push(run.promise());

                steps[i].call(this, input, run.resolve, run.reject);
            }

            return compat.when.apply(null, promises);
        };

        StaircaseProcess.prototype.step = function (levelNum, step) {

            if (typeof step !== 'function') {
                throw new Error('Invalid step! (not a function)');
            }

            if (typeof levelNum !== 'number') {
                throw new Error('Cannot register step! ' +
                                '(levelNum is not a number)');
            }

            if (this._knownSteps.indexOf(step) >= 0) {
                throw new Error('Cannot register step! ' +
                                '(already registered)');
            }

            if (!this._stepsByLevel[levelNum]) {
                this._stepsByLevel[levelNum] = [];
            }

            this._stepsByLevel[levelNum].push(step);
            this._knownSteps.push(step);
        };

        StaircaseProcess.prototype.run = function (input) {
            var process = this;

            console.debug('Starting process `' + this._name + '\'.');

            var cascade = [];
            var numSkipped = 0;
            for (var levelNum = 0;
                     levelNum < this._stepsByLevel.length;
                     levelNum++) {

                var steps = this._stepsByLevel[levelNum];

                if (!steps || !(steps instanceof Array) || !steps.length) {
                    numSkipped += 1;
                    continue;
                }

                var runLevel = compat.Deferred();
                cascade.push(runLevel.promise());

                var doRunLevel = (function (
                        input, levelNum, steps, runLevel) {

                    return function () {
                        StaircaseProcess.runLevel.call(process,
                                input, levelNum, steps)
                            .done(runLevel.resolve)
                            .fail(runLevel.reject);

                    };

                })(input, levelNum, steps, runLevel);

                if ((levelNum - numSkipped) === 0) {
                    doRunLevel();
                } else {
                    cascade[levelNum - 1 - numSkipped].done(doRunLevel);
                }
            }


            var run = compat.when.apply(null, cascade);

            run.done(function () {
                console.debug('All steps are done. ' +
                              'Process `' + process._name + '\' ' +
                              'is finished now.');
            });

            run.fail(function () {
                console.error('Process `' + process._name + '\' failed!');
            });

            return run.promise();
        };

        return StaircaseProcess;

    })(Assembly.compat);

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

                var process = new StaircaseProcess('Application initialization');

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
                                dependsOn: function () {
                                    var depSteps = Array.prototype.slice.call(arguments);
                                    input.appPrivate.ensurePriorSteps(stepName, depSteps, terminate);
                                }
                            };
                            var decoratedProceed = function () {
                                proceed();
                                input.appPrivate.initializeStepsFinished.push(stepName);
                            };
                            if (stepName !== 'Add_Base') {
                                context.dependsOn('Add_Base');
                            }
                            step.call(context, input.app, input.appPrivate, input.appConfig, decoratedProceed, terminate);
                        };

                        process.step(level, stepFn);
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
