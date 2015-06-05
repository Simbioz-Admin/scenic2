# Scenic 
Scenic is a stage teleconference system that allows for real time transmission of audiovisual data and arbitrary data flow over any IP network. Telepresence systems can be used in various artistic contexts, so that two different creatives spaces can communicate with each other or present a combined performance. Scenic is a rewrite and improvement of the previous Scenic software.

Scenic graphical user interface is available through use of a web browser. It is supporting multiple simultaneous users and secured with password.

## License
GNU GPL v3

## Project URL
http://code.sat.qc.ca/redmine/projects/scenic2

## Dependencies

- shmdata: http://code.sat.qc.ca/redmine/projects/libshmdata
- switcher: http://code.sat.qc.ca/redmine/projects/switcher
- chromium-browser

## Usage
Please refer to the documentation: http://code.sat.qc.ca/redmine/projects/scenic2/wiki/Scenic2_en

### Development

#### Setup

    sudo apt-get install nodejs-legacy chromium-browser npm
    sudo npm install -g bower
    gem update --system
    gem install compass
    
In the project folder:
    
    bower install

#### Quickstart
The simplest way to run Scenic from source is to start it from its own directory.
NPM dependencies will be downloaded automatically.
    
    ./scenic

#### Translation

##### Setup

    sudo npm install -g i18next-parser

##### Updating translation files: 

    i18next -l fr --directoryFilter '!.git, !.idea, !node_modules, !bower_components, !backup, !test, !tools, !assets' --fileFilter '*.js,*.html' -f '\$.t,\$.i18n.t,i18n.t,data-i18n' -r -n translation -k :: -s :::

##### Updating client side translation 

- in jquery
- inside a template, add 'data-i18n' inside the mark up containing the term to be translated, for instance data-i18n="value"

##### Included translation : 

Switcher:
Terms from switcher are added from the /server/settings/i18n.js file. At the launch of the server names and categories are automatically added to /locales/fr/translation.json if there are not existing file.

Scenic:
The terms for the client interface and messages from the server nodejs are scanned using the command above.

##### How to add translations:

1. Run the command above
2. recover the complete translations present in the /locales/en/translation_client
3. Add the translations in the file /locales/fr/translation.json CAUTION: Do not delete those that come from switcher.