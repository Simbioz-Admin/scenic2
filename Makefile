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

REQUIREJS := node_modules/.bin/r.js
COMPASS := compass

.PHONY: setup test build

build:
	@echo Building Scenic
	mkdir -p $(BUILD_DIR)
	@echo Installing server files
	install $(SERVER_FILES) $(BUILD_DIR)
	cp -r $(SERVER_SOURCE)/* $(BUILD_DIR)
	@echo Copying Locales
	cp -r $(LOCALES) $(BUILD_DIR)
	@echo Compiling Client Javascript
	mkdir -p $(BUILD_DIR_PUBLIC)
	$(REQUIREJS) -o $(CLIENT_SOURCE)/build.js out=$(BUILD_DIR_PUBLIC)/scenic.min.js
	@echo Compiling Stylesheets
	mkdir -p $(BUILD_DIR_PUBLIC)/css
	$(COMPASS) compile $(CLIENT) -c $(CLIENT)/config.rb -e production
	install $(CLIENT)/css/screen.css $(BUILD_DIR_PUBLIC)/css
	@echo Copying Assets
	mkdir -p $(BUILD_DIR_PUBLIC)/assets
	cp -r $(CLIENT_ASSETS)/* $(BUILD_DIR_PUBLIC)/assets
	@echo Making Run Script
	@echo "#!/bin/bash\nNODE_ENV=production NODE_PATH=\$$NODE_PATH:/usr/local/lib/nodejs:/usr/lib/nodejs node server.js \$$@" > $(BUILD_DIR)/scenic
	chmod +x $(BUILD_DIR)/scenic

install:
	@echo Installing Scenic
	mkdir -p $(DESTDIR)$(SCENICDIR)
	cp -r $(BUILD_DIR)/* $(DESTDIR)$(SCENICDIR)
	@echo Creating Run Script
	@echo "#!/bin/bash\nNODE_ENV=production NODE_PATH=\$$NODE_PATH:/usr/local/lib/nodejs:/usr/lib/nodejs node $(DESTDIR)$(SCENICDIR)/server.js \$$@" > $(DESTDIR)$(PREFIX)/bin/scenic
	chmod +x $(DESTDIR)$(PREFIX)/bin/scenic
	@echo Installing Launcher
	install -D scenic-launcher.desktop $(DESTDIR)$(PREFIX)/share/applications/
	@echo Installing dependencies
	cd $(DESTDIR)$(SCENICDIR) && npm update

uninstall:
	@echo Uninstalling
	rm -rf $(DESTDIR)$(SCENICDIR)
	@echo removed $(DESTDIR)$(SCENICDIR)
	rm $(DESTDIR)$(PREFIX)/bin/scenic
	rm $(DESTDIR)$(PREFIX)/share/applications/scenic-launcher.desktop

clean:
	@echo Cleaning
	rm -rf $(BUILD_DIR)

dist:
	mkdir -p $(ARCHIVE)
	install $(EXECFILES) $(ARCHIVE)
	install -m a+r $(SRCFILES) $(ARCHIVE)
	install $(ALTFILES) $(ARCHIVE)
	install scenic-launcher.desktop $(ARCHIVE)
	@for f in $(PROJDIRS); do \
		echo " copying $$f to archive"; \
		cp -r $$f $(ARCHIVE); \
		done;
	@echo building tarball
	@tar czf $(ARCHIVE).orig.tar.gz $(ARCHIVE)
	rm -fr $(ARCHIVE)
	@echo $(ARCHIVE).orig.tar.gz is done!


setup:
	sudo npm update -g bower gulp mocha
	npm update
	bower update

test:
	NODE_PATH=/usr/local/lib/nodejs:/usr/lib/nodejs mocha server/test/**/*.test.js
#	mocha client/test/**/*.test.js
#	mocha test/**/*.test.js

test-qm:
	NODE_PATH=/usr/local/lib/nodejs:/usr/lib/nodejs mocha server/test/integration/QuiddityLifecycle.test.js
