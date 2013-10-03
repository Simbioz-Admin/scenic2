PROJDIRS := js scenic templates assets
SRCFILES := package.json \
	server.js \
	index.html \
	login.html \
	scenic2

ALLFILES := $(PROJDIRS) $(SRCFILES)
TARGETDIR := /opt/scenic2

all:
	@echo Usage:
	@echo sudo make install

install: all
	@echo Making all
	@echo "node $(DESTDIR)$(TARGETDIR)/server.js" > scenic2
#	@echo installing chromium browser
#	apt-get install chromium-browser
	@echo building directories
	mkdir -p $(DESTDIR)$(TARGETDIR)
	@echo installing files
	install $(SRCFILES) $(DESTDIR)$(TARGETDIR)
	@for f in $(PROJDIRS); do \
		echo " copying $$f"; \
		cp -r $$f $(DESTDIR)$(TARGETDIR); \
		done; \
	cd $(DESTDIR)$(TARGETDIR) && npm cache clean node-switcher && npm install;\
	ln -nsf $(DESTDIR)$(TARGETDIR)/scenic2 /usr/local/bin
	install scenic-launcher.desktop /usr/local/share/applications
	install scenic-launcher.desktop $(DESTDIR)$(TARGETDIR)

uninstall:
	rm -rf $(DESTDIR)$(TARGETDIR)
	@echo removed $(DESTDIR)$(TARGETDIR)
	rm /usr/local/bin/scenic2
	rm /usr/local/share/applications/scenic-launcher.desktop

clean:
	@echo cleaning up
	@echo "node server.js" > scenic2

test:
	@echo "node $(DESTDIR)$(TARGETDIR)" > scenic2

dist:
	@tar czf scenic.tgz $(ALLFILES)
