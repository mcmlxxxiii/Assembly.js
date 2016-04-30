define([
    'Assembly/compat',
    'Assembly/util/misc'],

function (
    compat,
    utils) {


    function Core_Navigation(input, proceed, terminate) {
        var app = input.app;
        var priv = input.priv;
        var config = input.config;

        priv.ensureFeatures('Navigation', ['RequestHandling', 'Routing'],
                terminate);


        var navigationType = utils.objectHasValue(
                Core_Navigation.Type, config.navigation) ?
                    config.navigation :
                    Core_Navigation.Type.ANCHOR;

        var nav = {};
        switch (navigationType) {

            // NB: uri always includes baseUri.

            case Core_Navigation.Type.ANCHOR:
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
                    return nav.baseUri + '/#' + path;
                };
                break;

            case Core_Navigation.Type.PATH:
                nav.getUriFromElement = function (el) {
                    return compat.trim(el.getAttribute('href'));
                };
                nav.getUriFromLocationObject = function (loc) {
                    return loc.pathname;
                };
                nav.getPathFromUri = function (uri) {
                    return priv.stripBaseUri(uri);
                };
                nav.makeUriForPath = function (path) {
                    return nav.baseUri + path;
                };
                break;
        }

        // Any navigation parameter may be set/overwritten by the config.
        for (var k in nav) {
            if (typeof config[k] === 'function') {
                nav[k] = config[k];
            }
        }

        nav.baseUri = typeof config.baseUri === 'string' ? config.baseUri : '';

        // In case baseUri was overwritten, stripping trailing slashes from it.
        nav.baseUri = nav.baseUri.replace(/\/*$/, '');


        nav.linksSelector = typeof config.linksSelector === 'string' ?
                config.linksSelector : '[data-role=app-link]';


        priv.stripBaseUri = function (uri) {
            if (navigationType === Core_Navigation.Type.PATH) {
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

        priv.start.push(function () {
            window.onpopstate = function (e) {
                var uri = nav.getUriFromLocationObject(
                                 e.currentTarget.location);
                uri = priv.stripBaseUri(uri);
                var path = nav.getPathFromUri(uri);
                app._handleRequest({ path: path });
            };

            compat.liveBind(app.container, 'click', nav.linksSelector,
                    function (e) {

                e.preventDefault();
                e.stopPropagation();
                var uri = nav.getUriFromElement(this);
                uri = priv.stripBaseUri(uri);
                var path = nav.getPathFromUri(uri);
                app.navigateTo(path);
            });
        });

        priv.start.push(function () {
            var uri = nav.getUriFromLocationObject(window.location);
            uri = priv.stripBaseUri(uri);
            var path = nav.getPathFromUri(uri);
            app._handleRequest({ path: path });
        });

        priv.nav = nav;

        priv.features.push('Navigation');
        proceed();
    };

    Core_Navigation.Type = {
        ANCHOR: 'anchor',
        PATH: 'path'
    };

    return Core_Navigation;
});

