var require = {
    baseUrl: (window.location.pathname + '/js').replace('//', '/'),
    urlArgs: '_=' + (new Date()).getTime(),
    packages: [
       { name: 'DemoApp', location: './app', main: 'main' },
       { name: 'Assembly', location: '../../src', main: 'Assembly' }
    ],
    paths: {
        underscore: './lib/underscore-1.8.3.min',
        jquery: '../../lib/jquery-2.2.0.min',
        text: '../../lib/require-text-2.0.14'
    }
};
