define(function () {

    return function Settings(input, proceed, terminate) {
        var app = input.app;
        var priv = input.priv;
        var config = input.config;

        priv.ensureFeatures('Settings', ['LeveragingRequirejs'], terminate);


        if (!('settingsModule' in config)) {
            config.settingsModule = 'settings';
        }

        app._load(config.settingsModule).done(function (settings) {
            app.settings = settings;
            priv.features.push('Settings');
            proceed();
        }).fail(function () {
            terminate('Failed to load settings!');
        });
    };
});
