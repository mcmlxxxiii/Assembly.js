define(['Assembly'], function (Assembly) {

    Assembly.registerFeature('Settings__RequireJS', function (
            framework, frameworkPrivate, featureConfig) {

        this.registerInitializationStep('Add_Settings__RequireJS', function (
                app, appPrivate, appConfig, proceed, terminate) {

            this.dependsOn('Leverage_RequireJS');

            if (!('settingsModule' in appConfig)) {
                appConfig.settingsModule = 'settings';
            }

            app._load(appConfig.settingsModule).done(function (settings) {
                app.settings = settings;
                proceed();
            }).fail(function () {
                terminate('Failed to load settings!');
            });
        });
    });
});
