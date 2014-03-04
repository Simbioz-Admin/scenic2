define(
    [
        './settings/express',
        './settings/optimist',
        'config'
    ],

    function(app, optimist, config) {

        app.listen(config.port.scenic);
        return app;
    }
);