VERSION := $(shell ./scenic2 -v | cut -d ' ' -f3)
PROJDIRS := client_side server_side templates assets 
EXECFILES := scenic2 \
	scenic2-installer
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
TARGETDIR := /share/scenic2
ARCHIVE := scenic2_$(VERSION)

all:
	@echo Now run sudo make install
	@echo Scenic version $(VERSION)

install: all

	@echo Making all
	@echo "#!/bin/bash\nNODE_PATH=$$NODE_PATH:~/.scenic2/node_modules:/usr/local/lib/nodejs:/usr/lib/nodejs nodejs $(DESTDIR)$(TARGETDIR)/server.js \$$@" > scenic2
	@echo "#!/bin/bash\nNODE_PATH=$$NODE_PATH:~/.scenic2/node_modules nodejs $(DESTDIR)$(TARGETDIR)/npm-verify.js" > scenic2-installer
	@echo building directories for version $(VERSION)
	mkdir -p $(DESTDIR)$(TARGETDIR)
	@echo installing files 
	install $(EXECFILES) $(DESTDIR)$(TARGETDIR)
	install  -m a+r $(SRCFILES) $(DESTDIR)$(TARGETDIR)
	@for f in $(PROJDIRS); do \
		echo " copying $$f"; \
		cp -r $$f $(DESTDIR)$(TARGETDIR); \
		done; \
	install scenic2 $(DESTDIR)/bin
	install scenic2-installer $(DESTDIR)/bin
	install -D scenic-launcher.desktop $(DESTDIR)/share/applications
#	install -d scenic-launcher.desktop $(DESTDIR)$(TARGETDIR)
#	rm -fr ./tmp

uninstall:
	rm -rf $(DESTDIR)$(TARGETDIR)
	@echo removed $(DESTDIR)$(TARGETDIR)
	rm $(DESTDIR)/bin/scenic2
	rm $(DESTDIR)/bin/scenic2-installer
	rm $(DESTDIR)/share/applications/scenic-launcher.desktop

clean:
	@echo resetting paths in launch scripts
	@echo "NODE_PATH=\$$NODE_PATH:~/.scenic2/node_modules:/usr/local/lib/nodejs:/usr/lib/nodejs node server_side/server.js \$$@" > scenic2
	@echo "NODE_PATH=\$$NODE_PATH:~/.scenic2/node_modules node npm-verify.js" > scenic2-installer
#	rm -fr node_modules

test:
	@echo "node $(DESTDIR)$(TARGETDIR)" > scenic2

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
