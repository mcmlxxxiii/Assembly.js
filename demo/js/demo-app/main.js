define(['DemoFramework', 'underscore'],

function (DemoFramework, _) {

    var app = new DemoFramework.Application({
        name: 'DemoApp',
        baseUri: window.location.pathname,
        navigation: 'anchor',
        defineAppMediator: true,
        requireConfig: {
            urlArgs: "_=" + (new Date()).getTime(),
        },
        requireReuseGlobalPaths: [
            'text',
            'underscore'
        ]
    });

    app.MenuSection = {
        HOME: 'home',
        CITIES: 'cities',
        LINKS: 'links'
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

    app.renderTemplate = function (template, context) {
        return _.template(template)(app.commonTemplateContext(context || {}));
    };


    app._initialize = function () {
        var initialize = $.Deferred();

        app._load('views/LayoutView').done(function (LayoutView) {
            app._layoutView = new LayoutView();
            $(app.container).append(app._layoutView.DOM.container);
            initialize.resolve();
        });

        return initialize.promise();
    };

    return app.bootstrap;
});
