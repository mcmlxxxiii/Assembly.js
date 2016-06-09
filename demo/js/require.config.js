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
        'Assembly/util/Router': '../../src/util/Router',
        'Assembly/util/MiddlewareRunner': '../../src/util/MiddlewareRunner',
        'Assembly/util/MiddlewareEngine': '../../src/util/MiddlewareEngine',
        'Assembly/features/Middleware': '../../src/features/Middleware',
        'Assembly/features/AppInit': '../../src/features/AppInit',
        'Assembly/features/Navigation': '../../src/features/Navigation',
        'Assembly/features/RequestHandling': '../../src/features/RequestHandling',
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

        'Assembly/util/Router': {
            deps: ['Assembly/compat'],
            exports: 'Router'
        },

        'Assembly/util/MiddlewareRunner': {
            deps: ['Assembly/compat'],
            exports: 'MiddlewareRunner'
        },

        'Assembly/util/MiddlewareEngine': {
            deps: ['Assembly/compat', 'Assembly/util/MiddlewareRunner'],
            exports: 'MiddlewareEngine'
        },

        'Assembly/features/Middleware': ['Assembly', 'Assembly/util/MiddlewareEngine'],
        'Assembly/features/AppInit': ['Assembly'],
        'Assembly/features/Navigation': ['Assembly'],
        'Assembly/features/RequestHandling': ['Assembly']
    }
};
