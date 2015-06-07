# Scenic 
Scenic is a stage teleconference system that allows for real time transmission of audiovisual data and arbitrary data 
flow over any IP network. Telepresence systems can be used in various artistic contexts, so that two different creative
spaces can communicate with each other or present a combined performance. Scenic is a rewrite and improvement of the 
previous Scenic software.

Scenic graphical user interface is available through use of a web browser. It is supporting multiple simultaneous users 
and secured with password.

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
Install system dependencies:

    sudo apt-get install nodejs-legacy chromium-browser npm
    gem update --system
    
Then install development tools:

    sudo make setup

Alternatively this is what make setup does:

    sudo npm install -g bower mocha i18next-parser
    sydo gem install compass
    
#### Librairies
Install the required development libraries by running the following commands in the project folder:
    
    npm install
    bower install

#### Quickstart
The simplest way to run Scenic from source is to start it from its own directory.
    
    ./scenic

#### Translation

##### Setup
Parsing strings requires the i18next parser, it is installed by make setup mut can also be manually installed like so:

    sudo npm install -g i18next-parser

##### Updating translation files: 
Updates the localization files. It seperates into 3 namespaces: switcher, server and client. Making it much easier to
manage and update.

    make i18n
    
For reference purposes, here are the commands this will run:

    node tools/extract_switcher_i18n.js -o .tmp/switcher_strings.js
    i18next .tmp -l fr --fileFilter 'switcher_strings.js' -f '$$.t,$$.i18n.t,i18n.t,data-i18n' -r -n switcher -k :: -s :::
    rm .tmp/switcher_strings.js
    
    i18next server -l fr --directoryFilter '!test' --fileFilter '*.js,*.html' -f '$$.t,$$.i18n.t,i18n.t,data-i18n' -r -n server -k :: -s :::
    
    i18next client -l fr --directoryFilter '!.sass-cache, !assets, !css, !scss, !test' --fileFilter '*.js,*.html' -f '$$.t,$$.i18n.t,i18n.t,data-i18n' -r -n client -k :: -s :::

The translations that were in the json file but were not found while scanning the source code will be moved to a
namespace_old.json file, where the can be retrieved if necessary or for reference purposes (when part of a string
changed, for example)

##### Using localized strings
In the source code use ```i18n.t('your string')```, in html use ```data-i18n="your string"```. Both are parsed by the 
18n-parser and added to the localization resource files. The jQuery methos ```$.t('your string')``` can also be used.

##### How to translate

1. Run ```make i18n```
2. Translate the untraslated strings in locales/fr/namespace.json
3. Recover old translations from the namespace_old.json file if needed.