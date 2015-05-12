VERSION := $(shell ./scenic -v | cut -d ' ' -f3)
PROJDIRS := client server templates assets
EXECFILES := scenic \
	scenic-installer
SRCFILES := package.json \
	server.js \
	index.html \
	npm-verify.js
ALTFILES := COPYING \
	INSTALL \
	NEWS \
	README \
	Makefile

ALLFILES := $(PROJDIRS) $(SRCFILES)
TARGETDIR := /share/scenic
ARCHIVE := scenic_$(VERSION)

setup:
	npm install
	bower install

all:
	@echo Now run sudo make install
	@echo Scenic version $(VERSION)

install: all

	@echo Making all
	@echo "#!/bin/bash\nNODE_PATH=$$NODE_PATH:~/.scenic/node_modules:/usr/local/lib/nodejs:/usr/lib/nodejs nodejs $(DESTDIR)$(TARGETDIR)/server.js \$$@" > scenic
	@echo "#!/bin/bash\nNODE_PATH=$$NODE_PATH:~/.scenic/node_modules nodejs $(DESTDIR)$(TARGETDIR)/npm-verify.js" > scenic-installer
	@echo building directories for version $(VERSION)
	mkdir -p $(DESTDIR)$(TARGETDIR)
	@echo installing files 
	install $(EXECFILES) $(DESTDIR)$(TARGETDIR)
	install  -m a+r $(SRCFILES) $(DESTDIR)$(TARGETDIR)
	@for f in $(PROJDIRS); do \
		echo " copying $$f"; \
		cp -r $$f $(DESTDIR)$(TARGETDIR); \
		done; \
	install scenic $(DESTDIR)/bin
	install scenic-installer $(DESTDIR)/bin
	install -D scenic-launcher.desktop $(DESTDIR)/share/applications
#	install -d scenic-launcher.desktop $(DESTDIR)$(TARGETDIR)
#	rm -fr ./tmp

uninstall:
	rm -rf $(DESTDIR)$(TARGETDIR)
	@echo removed $(DESTDIR)$(TARGETDIR)
	rm $(DESTDIR)/bin/scenic
	rm $(DESTDIR)/bin/scenic-installer
	rm $(DESTDIR)/share/applications/scenic-launcher.desktop

clean:
	@echo resetting paths in launch scripts
	@echo "NODE_PATH=\$$NODE_PATH:~/.scenic/node_modules:/usr/local/lib/nodejs:/usr/lib/nodejs node server/server.js \$$@" > scenic
	@echo "NODE_PATH=\$$NODE_PATH:~/.scenic/node_modules node npm-verify.js" > scenic-installer
#	rm -fr node_modules

test:
	@echo "node $(DESTDIR)$(TARGETDIR)" > scenic

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
