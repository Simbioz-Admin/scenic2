#!/usr/bin/env python

import gtk
import webkit
import os
from threading import Thread

class TermKitView(object):
    def __init__(self):
        self.thread = Thread(target=self.__startProcess)
        self.thread.start()
        
        self.view = webkit.WebView()
        
        self.container = gtk.ScrolledWindow()
        self.container.add(self.view)
        
        self.window = gtk.Window(gtk.WINDOW_TOPLEVEL)
        self.window.set_title("Scenic2")
        self.window.set_position(gtk.WIN_POS_CENTER)
        self.window.set_default_size(440, 320)
        self.window.connect("destroy", self.destroy)

        self.window.add(self.container)
        self.window.show_all()
        
        self.view.open("http://localhost:8086")
    
    def start(self):
        gtk.main()
        
    def destroy(self, widget, data=None):
        print "> trying to quit....."
        self.thread._Thread__stop()
        gtk.main_quit()
    
    def __startProcess(self):
        os.system("./bin/node --harmony ./server.js ")

if __name__ == '__main__':
    termkit = TermKitView()
    termkit.start()
