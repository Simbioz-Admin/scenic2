VERSION := $(shell ./scenic2 -v)
PROJDIRS := js scenic templates assets node_modules
SRCFILES := package.json \
	server.js \
	index.html \
	login.html \
	scenic2 
ALTFILES := COPYING \
	INSTALL \
	NEWS \
	README \
	Makefile

ALLFILES := $(PROJDIRS) $(SRCFILES)
TARGETDIR := /opt/scenic2
ARCHIVE := scenic2_$(VERSION)

all:
	npm cache clean node-switcher && npm install
	cd node_modules/node-switcher; node-gyp clean; node-gyp rebuild; cd -
	@echo Now run sudo make install
	@echo $(VERSION)

install: all
	@echo Making all
	@echo "node $(DESTDIR)$(TARGETDIR)/server.js \$$@" > scenic2
#	@echo installing chromium browser
#	apt-get install chromium-browser
	@echo building directories for version $(VERSION)
	mkdir -p $(DESTDIR)$(TARGETDIR)
	@echo installing files 
	install $(SRCFILES) $(DESTDIR)$(TARGETDIR)
	@for f in $(PROJDIRS); do \
		echo " copying $$f"; \
		cp -r $$f $(DESTDIR)$(TARGETDIR); \
		done; \
	install scenic2 $(DESTDIR)/usr/local/bin
	install scenic-launcher.desktop $(DESTDIR)/usr/local/share/applications
	install scenic-launcher.desktop $(DESTDIR)$(TARGETDIR)

uninstall:
	rm -rf $(DESTDIR)$(TARGETDIR)
	@echo removed $(DESTDIR)$(TARGETDIR)
	rm $(DESTDIT)/usr/local/bin/scenic2
	rm $(DESTDIR)/usr/local/share/applications/scenic-launcher.desktop

clean:
	@echo cleaning up
	@echo "node server.js \$$@" > scenic2
	rm -fr node_modules

test:
	@echo "node $(DESTDIR)$(TARGETDIR)" > scenic2

dist:
	npm cache clean node-switcher && npm install
	mkdir -p $(ARCHIVE)
	install $(SRCFILES) $(ARCHIVE)
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
