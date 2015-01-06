define(
  [
    'i18next',
    'log',
  ],

  function(i18n, log) {
    
    i18n.init({
      lng: "en",
      saveMissing : true,
      resGetPath: 'locales/__lng__/__ns__.json',
      resSetPath: 'locales/__lng__/__ns__.json',
      fallbackLng : 'fr',  
      preload: ['en', 'fr'],
      sendMissingTo : 'fallback',
      debug: true
    }, function(){
       log.debug("Translation Init : ", i18n.lng());
    });

    // i18n.setLocale("en");
    // log.debug("Initialization i18n", i18n.getLocale());
    // i18n.configure({
    //     locales: ['fr'],
    //     directory: require.toUrl('.')+'/locales'
    // });


    // i18n.__("patate");


  }


);