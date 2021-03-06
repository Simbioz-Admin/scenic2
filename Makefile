VERSION := $(shell ./scenic -v | cut -d ' ' -f3)

PREFIX := /usr
SCENICDIR := $(PREFIX)/share/scenic
ARCHIVE := scenic_$(VERSION)

SERVER := server
SERVER_SOURCE := $(SERVER)/src
SERVER_FILES := package.json

CLIENT := client
CLIENT_SOURCE := $(CLIENT)/src
CLIENT_ASSETS := $(CLIENT)/assets

LOCALES := locales

BUILD_DIR := build
BUILD_DIR_PUBLIC := $(BUILD_DIR)/public

DIST_DIR := dist

REQUIREJS := node_modules/.bin/r.js
COMPASS := compass
NODE_PATH := NODE_PATH=/usr/local/lib/nodejs:/usr/lib/nodejs

.PHONY: setup dev test build package install dist i18n

build:
	@echo Cleaning previous build
	@rm -rf $(BUILD_DIR)
	@echo Updating Bower Dependencies
	bower update --allow-root
	@echo Building Scenic
	@mkdir -p $(BUILD_DIR)
	@echo Installing server files
	install $(SERVER_FILES) $(BUILD_DIR)
	@cp -r $(SERVER_SOURCE)/* $(BUILD_DIR)
	@echo Copying Locales
	@cp -r $(LOCALES) $(BUILD_DIR)
	@echo Compiling Client Javascript
	@mkdir -p $(BUILD_DIR_PUBLIC)
	$(REQUIREJS) -o $(CLIENT_SOURCE)/build.js out=$(BUILD_DIR_PUBLIC)/scenic.min.js
	@echo Compiling Stylesheets
	@mkdir -p $(BUILD_DIR_PUBLIC)/css
	$(COMPASS) compile $(CLIENT) -c $(CLIENT)/config.rb -e production
	install $(CLIENT)/css/screen.css $(BUILD_DIR_PUBLIC)/css
	@echo Copying Assets
	@mkdir -p $(BUILD_DIR_PUBLIC)/assets
	@cp -r $(CLIENT_ASSETS)/* $(BUILD_DIR_PUBLIC)/assets
	@echo Making Run Script
	@echo "#!/bin/bash\nNODE_ENV=production $(NODE_PATH) node server.js \$$@" > $(BUILD_DIR)/scenic
	chmod +x $(BUILD_DIR)/scenic

install:
	@echo Installing Scenic
	@mkdir -p $(DESTDIR)$(SCENICDIR)
	@cp -r $(BUILD_DIR)/* $(DESTDIR)$(SCENICDIR)
	@echo Creating Run Script
	@echo "#!/bin/bash\nNODE_ENV=production $(NODE_PATH) node $(DESTDIR)$(SCENICDIR)/server.js \$$@" > $(DESTDIR)$(PREFIX)/bin/scenic
	@chmod +x $(DESTDIR)$(PREFIX)/bin/scenic
	@echo Installing Launcher
	install -D scenic-launcher.desktop $(DESTDIR)$(PREFIX)/share/applications/
	@echo Installing dependencies
	cd $(DESTDIR)$(SCENICDIR) && npm update

uninstall:
	@echo Uninstalling
	@rm -rf $(DESTDIR)$(SCENICDIR)
	@echo removed $(DESTDIR)$(SCENICDIR)
	@rm $(DESTDIR)$(PREFIX)/bin/scenic
	@rm $(DESTDIR)$(PREFIX)/share/applications/scenic-launcher.desktop

clean:
	@echo Cleaning
	@rm -rf $(BUILD_DIR)

dist:
	@rm -rf $(DIST_DIR)/$(ARCHIVE)
	mkdir -p $(DIST_DIR)/$(ARCHIVE)$(SCENICDIR)
	cp -r $(BUILD_DIR)/* $(DIST_DIR)/$(ARCHIVE)$(SCENICDIR)
	@echo Creating Run Script
	mkdir -p $(DIST_DIR)/$(ARCHIVE)$(PREFIX)/bin
	@echo "#!/bin/bash\nNODE_ENV=production $(NODE_PATH) node $(DESTDIR)$(SCENICDIR)/server.js \$$@" > $(DIST_DIR)/$(ARCHIVE)$(PREFIX)/bin/scenic
	chmod +x $(DIST_DIR)/$(ARCHIVE)$(PREFIX)/bin/scenic
	@echo Installing Launcher
	mkdir -p $(DIST_DIR)/$(ARCHIVE)$(PREFIX)/share/applications
	install -D scenic-launcher.desktop $(DIST_DIR)/$(ARCHIVE)$(PREFIX)/share/applications/
	@echo Creating Debian metadata
	mkdir -p $(DIST_DIR)/$(ARCHIVE)/DEBIAN
	@echo "Package: scenic" > $(DIST_DIR)/$(ARCHIVE)/DEBIAN/control
	@echo "Version: $(VERSION)" >> $(DIST_DIR)/$(ARCHIVE)/DEBIAN/control
	@echo "Section: misc" >> $(DIST_DIR)/$(ARCHIVE)/DEBIAN/control
	@echo "Priority: optional" >> $(DIST_DIR)/$(ARCHIVE)/DEBIAN/control
	@echo "Architecture: all" >> $(DIST_DIR)/$(ARCHIVE)/DEBIAN/control
	@echo "Depends: libshmdata, switcher, nodejs-legacy, npm" >> $(DIST_DIR)/$(ARCHIVE)/DEBIAN/control
	@echo "Maintainer: Metalab <metalab@sat.qc.ca>" >> $(DIST_DIR)/$(ARCHIVE)/DEBIAN/control
	@echo "Description: Scenic" >> $(DIST_DIR)/$(ARCHIVE)/DEBIAN/control
	@echo Creating post install script
	@echo "cd $(DESTDIR)$(SCENICDIR) && npm update" >> $(DIST_DIR)/$(ARCHIVE)/DEBIAN/postinst
	chmod 755 $(DIST_DIR)/$(ARCHIVE)/DEBIAN/postinst
	dpkg-deb --build $(DIST_DIR)/$(ARCHIVE)
	#@cd $(DIST_DIR) && tar czf $(ARCHIVE).tar.gz $(ARCHIVE)
	@echo $(ARCHIVE).orig.tar.gz is done!

setup:
	npm install -g bower mocha i18next-parser

dev:
	npm update
	bower update --allow-root

test:
	$(NODE_PATH) mocha --recursive server/test

test-qm:
	$(NODE_PATH) mocha server/test/integration/QuiddityLifecycle.test.js

i18n:
	@echo Extracting switcher strings
	$(NODE_PATH) node tools/extract_switcher_i18n.js -o .tmp/switcher_strings.js
	@echo Parsing switcher strings
	i18next .tmp -l fr --fileFilter 'switcher_strings.js' -f '$$.t,$$.i18n.t,i18n.t,data-i18n' -r -n switcher -k :: -s :::
	@echo Removing temporary strings file
	rm .tmp/switcher_strings.js
	@echo Parsing server strings
	i18next server -l fr --directoryFilter '!test' --fileFilter '*.js,*.html' -f '$$.t,$$.i18n.t,i18n.t,data-i18n' -r -n server -k :: -s :::
	@echo Parsing client strings
	i18next client -l fr --directoryFilter '!.sass-cache, !assets, !css, !scss, !test' --fileFilter '*.js,*.html' -f '$$.t,$$.i18n.t,i18n.t,data-i18n' -r -n client -k :: -s :::
