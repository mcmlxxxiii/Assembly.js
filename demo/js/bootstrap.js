require(['DemoApp', 'jquery'], function (bootstrap, $) {
    bootstrap().done(function (appContainer) {
        $('body').append(appContainer);
    }).fail(function () {
        window.document.writeln('<h1>Please come back later ;(</h1>');
    });
});
