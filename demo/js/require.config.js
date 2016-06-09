var require = {
    baseUrl: (window.location.pathname + '/js').replace('//', '/'),
    urlArgs: '_=' + (new Date()).getTime(),
    packages: [
        { name: 'DemoApp', location: './demo-app' },
        { name: 'DemoFramework', location: './demo-framework' }
    ],
    paths: {
        Assembly: '../../src/Assembly',
        'Assembly/compat': '../../src/Assembly.compat.jQuery',
        'Assembly/contrib/util/Router': '../../src/contrib/util/Router',
        'Assembly/contrib/util/MiddlewareRunner': '../../src/contrib/util/MiddlewareRunner',
        'Assembly/contrib/util/MiddlewareEngine': '../../src/contrib/util/MiddlewareEngine',
        'Assembly/contrib/features/Middleware': '../../src/contrib/features/Middleware',
        'Assembly/contrib/features/AppInit': '../../src/contrib/features/AppInit',
        'Assembly/contrib/features/Navigation': '../../src/contrib/features/Navigation',
        'Assembly/contrib/features/RequestHandling': '../../src/contrib/features/RequestHandling',
        jquery: './lib/jquery-2.2.0.min',
        underscore: './lib/underscore-1.8.3.min',
        text: './lib/require-text-2.0.14'
    },
    shim: {
        Assembly: {
            deps: ['Assembly/compat'],
            exports: 'Assembly'
        },

        'Assembly/compat': {
            deps: ['jquery'],
            exports: 'Assembly/compat'
        },

        'Assembly/contrib/util/Router': {
            deps: ['Assembly/compat'],
            exports: 'Router'
        },

        'Assembly/contrib/util/MiddlewareRunner': {
            deps: ['Assembly/compat'],
            exports: 'MiddlewareRunner'
        },

        'Assembly/contrib/util/MiddlewareEngine': {
            deps: ['Assembly/compat', 'Assembly/contrib/util/MiddlewareRunner'],
            exports: 'MiddlewareEngine'
        },

        'Assembly/contrib/features/Middleware': ['Assembly', 'Assembly/contrib/util/MiddlewareEngine'],
        'Assembly/contrib/features/AppInit': ['Assembly'],
        'Assembly/contrib/features/Navigation': ['Assembly'],
        'Assembly/contrib/features/RequestHandling': ['Assembly']
    }
};
