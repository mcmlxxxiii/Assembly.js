var MultiLevelProcess = (function (compat) {

    function MultiLevelProcess(name) {
        this._name = name;
        this._stepsByLevel = [];
        this._knownSteps = [];
    }

    MultiLevelProcess.runLevel = function (input, levelNum, steps) {
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

    MultiLevelProcess.prototype.step = function (levelNum, step) {

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

    MultiLevelProcess.prototype.run = function (input) {
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
                    MultiLevelProcess.runLevel.call(process,
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

    return MultiLevelProcess;

})(Assembly_Compat);
