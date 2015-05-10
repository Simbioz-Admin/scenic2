define( [
    'i18next',
    'settings/log',
    'switcher',
    'underscore'
  ], function(i18n, log, switcher, _) {
      return {
        initialize: function() {
          i18n.init({
            // lng: "fr",
            saveMissing: true,
            // cookieName : 'lang',
            // useCookie : true,
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
            log.debug("Initializing translations for language: ", i18n.lng());
            //get name and category from switcher
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
        }
      }
  }
);