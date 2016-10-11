pkg.publicModule('app', function () {
    var pkg = this;

    var app = new DemoFramework.Application({
        name: 'DemoApp',
        baseUri: window.location.pathname,
        navigation: DemoFramework.NavigationType.ANCHOR,
        router: pkg.routes
    });


    app.MenuSection = {
        HOME: 'home',
        CITIES: 'cities',
        LINKS: 'links'
    };

    var translateActionReference = function (action) {
        var parts = action.split('#', 2);
        return {
            actionModule: 'actions.' + parts[0],
            actionMethod: parts[1] || null
        };
    };

    app.resolveActionMethod = function (actionReference, callback, errback) {

        if (typeof actionReference !== 'string') {
            throw new Error('Invalid action reference `' + actionReference.toString() + '\'.');
        }

        var ref = translateActionReference(actionReference);
        var actionMethod;

        if (ref) {
            var moduleName = ref.actionModule;
            var methodName = ref.actionMethod;

            var module = pkg(moduleName);

            var actionMethod = null;

            if (typeof module === 'function' && !methodName) {
                actionMethod = module;
            } else if ($.isPlainObject(module) && methodName &&
                    methodName in module &&
                    typeof module[methodName] === 'function') {
                actionMethod = module[methodName];
            }
        }

        if (actionMethod) {
            callback(actionMethod);
        } else {
            errback();
        }
    };

    app.handleActionSuccess = function (request, response) {
        if (response.title) {
            window.document.title = response.title;
            app._layoutView.setTitle(response.title, response.titleSecondaryText);
        }

        app._layoutView.setMenuSection(response.menuSection || null);

        if (response.view) {
            $(app._layoutView.DOM.pageBody)
                    .empty().append(response.view.DOM.container);
        } else {
            $(app._layoutView.DOM.pageBody)
                    .html(response.pageHtml || '');
        }
    };

    app.handleActionFailure = function (request, response) {
        window.document.title = response;
        alert('Mayday! Mayday! ' + response);
    };


    app.commonTemplateContext = function (context) {
        return $.extend(true, {}, context || {}, {
            linkTo: _.bind(app.linkTo, app)
        });
    };

    app.renderTemplate = function (templateName, context) {
        var templateCode = $('script#' + templateName).html();
        var template = _.template(templateCode);
        return template(app.commonTemplateContext(context));
    };


    app._initialize = function () {
        var initialize = $.Deferred();

        app._layoutView = new pkg.views.LayoutView();
        $(app.container).append(app._layoutView.DOM.container);
        initialize.resolve();

        return initialize.promise();
    };

    return app;
});
