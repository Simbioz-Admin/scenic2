define(
    [
        'i18n',
        'log',
    ],

    function(i18n, log) {

        i18n.setLocale("en");
        log.debug("Initialization i18n", i18n.getLocale());
        i18n.configure({
            locales: ['en', 'fr'],
            directory: 'locales'
        });


        i18n.__("patate");


    }


);