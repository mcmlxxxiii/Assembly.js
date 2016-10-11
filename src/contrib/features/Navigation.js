Assembly.registerFeature('Navigation', function (
        framework, frameworkPrivate, featureConfig) {

    function objectHasValue(obj, value) {
        for (var key in obj) {
            if (obj[key] === value) return key;
        }
    }

    var compat = Assembly.compat;

    framework.NavigationType = {
        ANCHOR: 'anchor',
        PATH: 'path'
    };

    this.registerInitializationStep('Add_Navigation', function (
            app, appPrivate, appConfig, proceed, terminate) {

        this.dependsOnSteps('Add_Request_Handling', 'Add_Routing');

        var navigationType = objectHasValue(
                framework.NavigationType, appConfig.navigation) ?
                    appConfig.navigation :
                    framework.NavigationType.ANCHOR;

        var nav = {};
        switch (navigationType) {

            // NB: uri always includes baseUri.

            case framework.NavigationType.ANCHOR:
                nav.getUriFromElement = function (el) {
                    return compat.trim(el.getAttribute('href'));
                };
                nav.getUriFromLocationObject = function (loc) {
                    return loc.hash;
                };
                nav.getPathFromUri = function (uri) {
                    var i = uri.indexOf('#');
                    if (i >= 0) {
                        uri = uri.substr(uri.indexOf('#') + 1)
                    } else {
                        console.warn('Could not get path from ' +
                                     'uri `' + uri + '\'; ' +
                                     'falling back to `/\'.');
                        uri = '/';
                    }
                    return uri;
                };
                nav.makeUriForPath = function (path) {
                    return nav.baseUri + '#' + path;
                };
                break;

            case framework.NavigationType.PATH:
                nav.getUriFromElement = function (el) {
                    return compat.trim(el.getAttribute('href'));
                };
                nav.getUriFromLocationObject = function (loc) {
                    return loc.pathname;
                };
                nav.getPathFromUri = function (uri) {
                    return appPrivate.stripBaseUri(uri);
                };
                nav.makeUriForPath = function (path) {
                    return nav.baseUri + path;
                };
                break;
        }

        // Any navigation parameter may be set/overwritten by the config.
        for (var k in nav) {
            if (typeof appConfig[k] === 'function') {
                nav[k] = appConfig[k];
            }
        }

        nav.baseUri = typeof appConfig.baseUri === 'string' ? appConfig.baseUri : '';

        // In case baseUri was overwritten, stripping trailing slashes from it.
        nav.baseUri = nav.baseUri.replace(/\/*$/, '');


        nav.linksSelector = typeof appConfig.linksSelector === 'string' ?
                appConfig.linksSelector : '[data-role=app-link]';


        appPrivate.stripBaseUri = function (uri) {
            if (navigationType === framework.NavigationType.PATH) {
                if (uri.substr(0, nav.baseUri.length) === nav.baseUri) {
                    uri = uri.substr(nav.baseUri.length);
                }
                uri = uri.replace(/^\/*/, '/');
            }
            return uri;
        };

        app.pathFor = function (routeName, pathParams) {
            return app._router.constructPath.apply(app._router, arguments);
        };

        app.linkTo = function (routeName, pathParams) {
            return nav.makeUriForPath(app.pathFor.apply(app, arguments));
        };

        app.navigateTo = function (path) {
            app._handleRequest({ path: path }).done(function () {
                window.history.pushState(
                    null, null, nav.makeUriForPath(path));
            });
        };

        app.navigateToRoute = function (routeName, routeParams) {
            app.navigateTo(app.pathFor.apply(app, arguments));
        };

        appPrivate.start.push(function () {
            window.onpopstate = function (e) {
                var uri = nav.getUriFromLocationObject(
                                 e.currentTarget.location);
                uri = appPrivate.stripBaseUri(uri);
                var path = nav.getPathFromUri(uri);
                app._handleRequest({ path: path });
            };

            compat.liveBind(app.container, 'click', nav.linksSelector,
                    function (e) {

                e.preventDefault();
                e.stopPropagation();
                var uri = nav.getUriFromElement(this);
                uri = appPrivate.stripBaseUri(uri);
                var path = nav.getPathFromUri(uri);
                app.navigateTo(path);
            });
        });

        appPrivate.start.push(function () {
            var uri = nav.getUriFromLocationObject(window.location);
            uri = appPrivate.stripBaseUri(uri);
            var path = nav.getPathFromUri(uri);
            app._handleRequest({ path: path });
        });

        appPrivate.nav = nav;

        proceed();
    });
});
