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
        'Assembly/contrib/utils/Router': '../../src/contrib/utils/Router',
        'Assembly/contrib/utils/MiddlewareRunner': '../../src/contrib/utils/MiddlewareRunner',
        'Assembly/contrib/utils/MiddlewareEngine': '../../src/contrib/utils/MiddlewareEngine',
        'Assembly/MultiLevelProcess': '../../src/MultiLevelProcess',
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
            deps: ['Assembly/compat', 'Assembly/MultiLevelProcess'],
            exports: 'Assembly'
        },

        'Assembly/compat': {
            deps: ['jquery'],
            exports: 'Assembly/compat'
        },

        'Assembly/MultiLevelProcess': {
            deps: ['Assembly/compat'],
            exports: 'MultiLevelProcess'
        },

        'Assembly/contrib/utils/Router': {
            deps: ['Assembly/compat'],
            exports: 'Router'
        },

        'Assembly/contrib/utils/MiddlewareRunner': {
            deps: ['Assembly/compat'],
            exports: 'MiddlewareRunner'
        },

        'Assembly/contrib/utils/MiddlewareEngine': {
            deps: ['Assembly/compat', 'Assembly/contrib/utils/MiddlewareRunner'],
            exports: 'MiddlewareEngine'
        },

        'Assembly/contrib/features/Middleware': ['Assembly', 'Assembly/contrib/utils/MiddlewareEngine'],
        'Assembly/contrib/features/AppInit': ['Assembly'],
        'Assembly/contrib/features/Navigation': ['Assembly'],
        'Assembly/contrib/features/RequestHandling': ['Assembly']
    }
};
