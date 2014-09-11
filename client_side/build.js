({
    baseUrl: '.',
    name: 'main',
    out: 'main-built.js',
    paths: {
        underscore: 'libs/underscore-min',
        backbone: 'libs/backbone-min',
        util: 'libs/util',
        jqueryui: 'libs/jqueryui/js/jquery-ui-1.10.2.custom.min',
        punch: 'libs/punch',
        jquery: 'libs/jquery-min',
        jqueryCookie: 'libs/jquery.cookie',
        smartMenu: 'libs/smartmenus/jquery.smartmenus.min'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        jqueryui: {
            deps: ["jquery"],
            exports: "jqueryui"
        },
        punch: {
            deps: ['jquery', 'jqueryui']
        },
        jqueryCookie: {
            deps: ['jquery'],
            exports: 'jquerycookie'
        },
        smartMenu: {
            deps: ['jquery'],
            exports: 'smartMenu'
        }
    }
})