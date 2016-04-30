define(['router'], function (router) {

    router.addRoute({
        path: '/',
        name: 'home',
        action: 'pages#page',
        params: {
            name: 'home'
        }
    });

    router.addRoute({
        path: '/cities',
        name: 'cities',
        action: 'pages#cities'
    });

    router.addRoute({
        pattern: '/cities/:token',
        name: 'city',
        action: 'pages#city'
    });

    router.addRoute({
        pattern: '/pages/:name',
        name: 'page',
        action: 'pages#page'
    });

    router.addRoute({
        path: '/failing',
        name: 'failing',
        action: 'failing'
    });

    router.addRoute({
        pattern: '/*',
        action: 'notFound'
    });
});
