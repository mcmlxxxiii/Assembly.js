require(['DemoApp'], function (bootstrap) {
    bootstrap().done(function (appContainer) {
        window.document.body.appendChild(appContainer);
    }).fail(function () {
        window.document.writeln('<h1>Please come back later ;(</h1>');
    });
});
