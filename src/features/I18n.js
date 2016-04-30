define(['Assembly/compat',
        'Assembly/util/misc'],

function (compat,
          utils) {


    function I18n(input, proceed, terminate) {
        var app = input.app;
        var priv = input.priv;
        var config = input.config;

        priv.ensureFeatures('I18n', ['LeveragingRequirejs'], terminate);


        if (!('locale' in config)) {
            config.locale = window.navigator.language;
        } else if (!I18n.validateLocale(config.locale)) {
            throw new Error('Invalid locale (' + config.locale + ')!');
        }

        if (!(config.locales instanceof Array)) {
            throw new Error('Invalid `locales\' option (not an array)!');
        }

        if (!config.locales.length) {
            throw new Error('No locales configured!');
        }

        for (var i = 0, l = config.locales.length; i < l; i++) {
            if (!I18n.validateLocale(config.locales[i])) {
                throw new Error('Bad locale in locales option ' +
                                '(' + config.locales[i] + ')!');
            }
        }


        priv._initializeLocale = function () {
            var init = compat.Deferred();
            var localeToLoad;
            var localeLang = config.locale.split('-')[0];

            if (config.locales.indexOf(config.locale) >= 0) {
                localeToLoad = app.locale;
            } else if (config.locales.indexOf(localeLang) >= 0) {
                localeToLoad = localeLang;
            } else {
                localeToLoad = config.locales[0];
            }

            var localeModule = 'locales/' + localeToLoad;
            app._load(localeModule).done(function (localeData) {
                if (!compat.isPlainObject(localeData)) {
                    init.reject('Locale data is invalid (not a plain object)!');
                }

                app._localeData = localeData;

                app.makeT = function (namespace) {
                    return I18n.makeT(app._localeData, namespace);
                };

                app.makeY = function (namespace) {
                    return I18n.makeY(app._localeData, namespace);
                };

                app.globalT = app.makeT();
                app.globalY = app.makeY();

                app.locale = localeToLoad;

                init.resolve();
            }).fail(function () {
                init.reject('Locale data failed to load ' +
                            'from `' + localeModule + '\'!');
            });

            return init.promise();
        }

        priv._initializeLocale().fail(terminate).done(function () {
            priv.features.push('I18n');
            proceed();
        });
    };

    I18n.makeT = function (localeData, namespace) {
        return function T(key) {
            if (typeof key !== 'string') return '(?)';

            var path = namespace !== undefined
                          ? namespace.toString() + '.' + key
                          : key;
            var res = utils.getValueFromNestedObject(localeData, path);

            if (res === undefined) {
                res = '[' + path + ']';
            } else if (typeof res === 'function') {
                var args = Array.prototype.slice.call(arguments, 1);
                res = res.apply(null, args);
            } else if (typeof res !== 'string') {
                res = '(?' + key + '?)';
            }

            return res;
        }
    };

    I18n.makeY = function (localeData, namespace) {
        return function Y(key) {
            var path = namespace !== undefined
                          ? namespace.toString() + '.' + key.toString()
                          : key.toString();
            return utils.getValueFromNestedObject(localeData, path);
        };
    };

    I18n.validateLocale = function (locale) {
        return typeof locale === 'string' &&
            I18n.LOCALE_REGEXP.test(locale);
    };

    I18n.LOCALE_REGEXP = /^[a-z]{2}(\-[A-Z]{2})?$/; // en || en-US


    return I18n;
});
