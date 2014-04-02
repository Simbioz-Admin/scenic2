VERSION := $(shell ./scenic2 -v)
PROJDIRS := js scenic templates assets 
SRCFILES := package.json \
	server.js \
	index.html \
	login.html \
	scenic2 \
	npm-verify.js \
	scenic2-installer
ALTFILES := COPYING \
	INSTALL \
	NEWS \
	README \
	Makefile

ALLFILES := $(PROJDIRS) $(SRCFILES)
TARGETDIR := /opt/scenic2
ARCHIVE := scenic2_$(VERSION)

all:
	@echo Now run sudo make install
	@echo $(VERSION)

install: all
	@echo Making all
	@echo "#!/bin/bash\nNODE_PATH=$$NODE_PATH:~/.scenic2/node_modules nodejs $(TARGETDIR)/server.js \$$@" > scenic2
	@echo "#!/bin/bash\nNODE_PATH=$$NODE_PATH:~/.scenic2/node_modules nodejs $(TARGETDIR)/npm-verify.js" > scenic2-installer
#	@echo installing chromium browser
#	apt-get install chromium-browser
	@echo building directories for version $(VERSION)
	mkdir -p $(TARGETDIR)
	@echo installing files 
	install $(SRCFILES) $(TARGETDIR)
	@for f in $(PROJDIRS); do \
		echo " copying $$f"; \
		cp -r $$f $(TARGETDIR); \
		done; \
	install scenic2 $(DESTDIR)/bin
	install scenic2-installer $(DESTDIR)/bin
	install scenic-launcher.desktop $(DESTDIR)/share/applications
	install scenic-launcher.desktop $(TARGETDIR)

uninstall:
	rm -rf $(TARGETDIR)
	@echo removed $(TARGETDIR)
	rm $(DESTDIR)/bin/scenic2
	rm $(DESTDIR)/bin/scenic2-installer
	rm $(DESTDIR)/share/applications/scenic-launcher.desktop

clean:
	@echo cleaning up
	@echo "NODE_PATH=\$$NODE_PATH:~/.scenic2/node_modules node server.js \$$@" > scenic2
	@echo "NODE_PATH=\$$NODE_PATH:~/.scenic2/node_modules node npm-verify.js" > scenic2-installer
	rm -fr node_modules

test:
	@echo "node $(DESTDIR)$(TARGETDIR)" > scenic2

dist:
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
