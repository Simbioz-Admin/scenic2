define(
  [
    'i18next',
    'log',
    'switcher',
    'underscore'
  ],

  function(i18n, log, switcher, _) {

    i18n.init({
      lng: "fr",
      saveMissing: true,
      ns : 'translation',
      resGetPath: 'locales/__lng__/__ns__.json',
      resSetPath: 'locales/__lng__/__ns__.json',
      fallbackLng: 'fr',
      preload: ['en', 'fr'],
      sendMissingTo: 'fallback',
      keyseparator : "::",
      nsseparator : ':::',
      debug: true
    }, function() {
      log.debug("Translation Init : ", i18n.lng());


      console.log('Scan information switcher for translation');
      var classesDoc = JSON.parse(switcher.get_classes_doc()).classes;
      _.each(classesDoc, function(classDoc) {
        i18n.t(classDoc['long name']);
        i18n.t(classDoc['category']);
        var className = classDoc['class name'];
        try {
          var propertiesByClass = JSON.parse(switcher.get_properties_description_by_class(className)).properties;
          _.each(propertiesByClass, function(prop) {

            i18n.t(prop['long name']);
            i18n.t(prop['short description']);

            if(prop['short description'].indexOf('port pairs with destinations') >= 0){
              // console.log(prop);
            }
          });
        } catch (e) {

        }
      });
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