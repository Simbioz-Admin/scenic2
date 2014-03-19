VERSION := $(shell ./run -v)
PROJDIRS := js scenic templates assets 
SRCFILES := package.json \
	server.js \
	index.html \
	login.html \
	scenic2 \
	npm-verify.js \
	run
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
	@echo "#!/bin/bash\nNODE_PATH=$$NODE_PATH:~/.scenic2/node_modules && nodejs $(DESTDIR)$(TARGETDIR)/server.js \$$@" > run
	@echo "#!/bin/bash\nNODE_PATH=$$NODE_PATH:~/.scenic2/node_modules && nodejs $(DESTDIR)$(TARGETDIR)/npm-verify.js" > scenic2
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
	@echo "NODE_PATH=\$$NODE_PATH:~/.scenic2/node_modules && node server.js \$$@" > run
	@echo "NODE_PATH=\$$NODE_PATH:~/.scenic2/node_modules && node npm-verify.js" > scenic2
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
