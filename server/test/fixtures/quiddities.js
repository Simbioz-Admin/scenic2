module.exports = {

    classes_doc: function () {
        return {
            "classes": [
                {
                    "long name":         "Jack Audio Device2",
                    "category":          "audio",
                    "short description": "get audio from jack",
                    "license":           "LGPL",
                    "class name":        "2jacksrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Switcher OSC Controler",
                    "category":          "control server",
                    "short description": "OSCcontrolServer allows for managing switcher through OSC",
                    "license":           "LGPL",
                    "class name":        "OSCctl",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "OSC Receiver",
                    "category":          "network",
                    "short description": "receives OSC messages and write to shmdata",
                    "license":           "LGPL",
                    "class name":        "OSCsrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Switcher Web Client (SOAP)",
                    "category":          "control client",
                    "short description": "controling a switcher instance through SOAP webservices",
                    "license":           "GPL",
                    "class name":        "SOAPcontrolClient",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Switcher Web Controler (SOAP)",
                    "category":          "control server",
                    "short description": "getting switcher controled through SOAP webservices",
                    "license":           "GPL",
                    "class name":        "SOAPcontrolServer",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Sine",
                    "category":          "audio",
                    "short description": "Creates audio test signals",
                    "license":           "LGPL",
                    "class name":        "audiotestsrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Quiddity Creation Inspector",
                    "category":          "spy",
                    "short description": "spy manager for quidity creation and removal and convert into signals",
                    "license":           "LGPL",
                    "class name":        "create_remove_spy",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Shmdata Decoder",
                    "category":          "decoder",
                    "short description": "connect to a shmdata, decode it and write decoded frames to shmdata(s)",
                    "license":           "LGPL",
                    "class name":        "decodebin",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Dictionary",
                    "category":          "dictionary",
                    "short description": "Dictionary of string key/values accessible through properties",
                    "license":           "LGPL",
                    "class name":        "dico",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Raw Shmdata",
                    "category":          "other",
                    "short description": "add a shmdata from an other software",
                    "license":           "LGPL",
                    "class name":        "fakeshmsrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Shmdata Inspector",
                    "category":          "monitor",
                    "short description": "fakesink for testing purpose",
                    "license":           "LGPL",
                    "class name":        "fakesink",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "GStreamer Pipeline",
                    "category":          "other",
                    "short description": "GStreamer (src) pipeline description to a *single* shmdata",
                    "license":           "LGPL",
                    "class name":        "gstsrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "GStreamer Video Pipeline",
                    "category":          "other",
                    "short description": "GStreamer (src) video pipeline description to a *single* shmdata",
                    "license":           "LGPL",
                    "class name":        "gstvideosrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Video Display (configurable)",
                    "category":          "video",
                    "short description": "Video window with fullscreen",
                    "license":           "LGPL",
                    "class name":        "gtkvideosink",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "HTTP/SDP Player",
                    "category":          "network",
                    "short description": "decode an sdp-described stream deliver through http and make shmdatas",
                    "license":           "LGPL",
                    "class name":        "httpsdpdec",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Audio Display (Jack)",
                    "category":          "audio",
                    "short description": "Audio display",
                    "license":           "LGPL",
                    "class name":        "jacksink",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Jack Audio Device",
                    "category":          "audio",
                    "short description": "get audio from jack",
                    "license":           "LGPL",
                    "class name":        "jacksrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Switcher Logger",
                    "category":          "log",
                    "short description": "manage switcher logs and other glib log domains.",
                    "license":           "LGPL",
                    "class name":        "logger",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Midi (Port Midi)",
                    "category":          "midi",
                    "short description": "shmdata to midi",
                    "license":           "LGPL",
                    "class name":        "midisink",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Midi (PortMidi)",
                    "category":          "midi",
                    "short description": "midi to shmdata and properties",
                    "license":           "LGPL",
                    "class name":        "midisrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "My Plugin",
                    "category":          "test",
                    "short description": "Creates a quiddity from a plugin",
                    "license":           "LGPL",
                    "class name":        "myplugin",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Switcher Property Mapper",
                    "category":          "mapper",
                    "short description": "map two properties, one being slave of the other",
                    "license":           "LGPL",
                    "class name":        "property-mapper",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Audio Display (Pulse)",
                    "category":          "audio",
                    "short description": "Inspecting Devices And Playing Audio To Outputs",
                    "license":           "LGPL",
                    "class name":        "pulsesink",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Pulse Audio Device",
                    "category":          "audio",
                    "short description": "Inspecting Devices And Getting Audio From Inputs",
                    "license":           "LGPL",
                    "class name":        "pulsesrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "RTP Session",
                    "category":          "network",
                    "short description": "RTP session manager",
                    "license":           "LGPL",
                    "class name":        "rtpsession",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "OSC sender",
                    "category":          "network",
                    "short description": "shmOSCsink reveives OSC messages and updates associated property",
                    "license":           "LGPL",
                    "class name":        "shmOSCsink",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Shmdata File Player",
                    "category":          "shmdata file player",
                    "short description": "play file(s) recorded with shmdatatofile",
                    "license":           "LGPL",
                    "class name":        "shmfromfilesource",
                    "author":            "Nicolas Bouillot, Emmanuel Durand"
                },
                {
                    "long name":         "Shmdata Recorder",
                    "category":          "file recorder",
                    "short description": "record shmdata(s) to file(s)",
                    "license":           "LGPL",
                    "class name":        "shmtofilesink",
                    "author":            "Nicolas Bouillot, Emmanuel Durand"
                },
                {
                    "long name":         "SIP (Session Initiation Protocol)",
                    "category":          "network",
                    "short description": "Manages user sessions",
                    "license":           "LGPL",
                    "class name":        "sip",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "SystemUsage plugin",
                    "category":          "SystemUsage",
                    "short description": "Gives system load information",
                    "license":           "LGPL",
                    "class name":        "systemusage",
                    "author":            "Emmanuel Durand"
                },
                {
                    "long name":         "UDP Sender",
                    "category":          "network",
                    "short description": "send data stream with udp",
                    "license":           "LGPL",
                    "class name":        "udpsink",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "URI/URL Player",
                    "category":          "network",
                    "short description": "decode an URI and writes to shmdata(s)",
                    "license":           "LGPL",
                    "class name":        "urisrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "v4l2 Video Capture",
                    "category":          "video",
                    "short description": "Discover and use v4l2 supported capture cards and cameras",
                    "license":           "GPL",
                    "class name":        "v4l2src",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Video Display (basic)",
                    "category":          "video",
                    "short description": "Video window with minimal features",
                    "license":           "LGPL",
                    "class name":        "videosink",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Video Pattern",
                    "category":          "video",
                    "short description": "Creates a test video stream",
                    "license":           "LGPL",
                    "class name":        "videotestsrc",
                    "author":            "Nicolas Bouillot"
                }
            ]
        }
    },

    classes_doc_public: function () {
        return {
            "classes": [
                {
                    "long name":         "Jack Audio Device2",
                    "category":          "audio",
                    "short description": "get audio from jack",
                    "license":           "LGPL",
                    "class name":        "2jacksrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Switcher OSC Controler",
                    "category":          "control server",
                    "short description": "OSCcontrolServer allows for managing switcher through OSC",
                    "license":           "LGPL",
                    "class name":        "OSCctl",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "OSC Receiver",
                    "category":          "network",
                    "short description": "receives OSC messages and write to shmdata",
                    "license":           "LGPL",
                    "class name":        "OSCsrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Switcher Web Client (SOAP)",
                    "category":          "control client",
                    "short description": "controling a switcher instance through SOAP webservices",
                    "license":           "GPL",
                    "class name":        "SOAPcontrolClient",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Sine",
                    "category":          "audio",
                    "short description": "Creates audio test signals",
                    "license":           "LGPL",
                    "class name":        "audiotestsrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Shmdata Decoder",
                    "category":          "decoder",
                    "short description": "connect to a shmdata, decode it and write decoded frames to shmdata(s)",
                    "license":           "LGPL",
                    "class name":        "decodebin",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Raw Shmdata",
                    "category":          "other",
                    "short description": "add a shmdata from an other software",
                    "license":           "LGPL",
                    "class name":        "fakeshmsrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Shmdata Inspector",
                    "category":          "monitor",
                    "short description": "fakesink for testing purpose",
                    "license":           "LGPL",
                    "class name":        "fakesink",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "GStreamer Pipeline",
                    "category":          "other",
                    "short description": "GStreamer (src) pipeline description to a *single* shmdata",
                    "license":           "LGPL",
                    "class name":        "gstsrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "GStreamer Video Pipeline",
                    "category":          "other",
                    "short description": "GStreamer (src) video pipeline description to a *single* shmdata",
                    "license":           "LGPL",
                    "class name":        "gstvideosrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Video Display (configurable)",
                    "category":          "video",
                    "short description": "Video window with fullscreen",
                    "license":           "LGPL",
                    "class name":        "gtkvideosink",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "HTTP/SDP Player",
                    "category":          "network",
                    "short description": "decode an sdp-described stream deliver through http and make shmdatas",
                    "license":           "LGPL",
                    "class name":        "httpsdpdec",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Audio Display (Jack)",
                    "category":          "audio",
                    "short description": "Audio display",
                    "license":           "LGPL",
                    "class name":        "jacksink",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Jack Audio Device",
                    "category":          "audio",
                    "short description": "get audio from jack",
                    "license":           "LGPL",
                    "class name":        "jacksrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Midi (Port Midi)",
                    "category":          "midi",
                    "short description": "shmdata to midi",
                    "license":           "LGPL",
                    "class name":        "midisink",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Midi (PortMidi)",
                    "category":          "midi",
                    "short description": "midi to shmdata and properties",
                    "license":           "LGPL",
                    "class name":        "midisrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "My Plugin",
                    "category":          "test",
                    "short description": "Creates a quiddity from a plugin",
                    "license":           "LGPL",
                    "class name":        "myplugin",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Switcher Property Mapper",
                    "category":          "mapper",
                    "short description": "map two properties, one being slave of the other",
                    "license":           "LGPL",
                    "class name":        "property-mapper",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Audio Display (Pulse)",
                    "category":          "audio",
                    "short description": "Inspecting Devices And Playing Audio To Outputs",
                    "license":           "LGPL",
                    "class name":        "pulsesink",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Pulse Audio Device",
                    "category":          "audio",
                    "short description": "Inspecting Devices And Getting Audio From Inputs",
                    "license":           "LGPL",
                    "class name":        "pulsesrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "RTP Session",
                    "category":          "network",
                    "short description": "RTP session manager",
                    "license":           "LGPL",
                    "class name":        "rtpsession",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "OSC sender",
                    "category":          "network",
                    "short description": "shmOSCsink reveives OSC messages and updates associated property",
                    "license":           "LGPL",
                    "class name":        "shmOSCsink",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Shmdata File Player",
                    "category":          "shmdata file player",
                    "short description": "play file(s) recorded with shmdatatofile",
                    "license":           "LGPL",
                    "class name":        "shmfromfilesource",
                    "author":            "Nicolas Bouillot, Emmanuel Durand"
                },
                {
                    "long name":         "Shmdata Recorder",
                    "category":          "file recorder",
                    "short description": "record shmdata(s) to file(s)",
                    "license":           "LGPL",
                    "class name":        "shmtofilesink",
                    "author":            "Nicolas Bouillot, Emmanuel Durand"
                },
                {
                    "long name":         "SIP (Session Initiation Protocol)",
                    "category":          "network",
                    "short description": "Manages user sessions",
                    "license":           "LGPL",
                    "class name":        "sip",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "UDP Sender",
                    "category":          "network",
                    "short description": "send data stream with udp",
                    "license":           "LGPL",
                    "class name":        "udpsink",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "URI/URL Player",
                    "category":          "network",
                    "short description": "decode an URI and writes to shmdata(s)",
                    "license":           "LGPL",
                    "class name":        "urisrc",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "v4l2 Video Capture",
                    "category":          "video",
                    "short description": "Discover and use v4l2 supported capture cards and cameras",
                    "license":           "GPL",
                    "class name":        "v4l2src",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Video Display (basic)",
                    "category":          "video",
                    "short description": "Video window with minimal features",
                    "license":           "LGPL",
                    "class name":        "videosink",
                    "author":            "Nicolas Bouillot"
                },
                {
                    "long name":         "Video Pattern",
                    "category":          "video",
                    "short description": "Creates a test video stream",
                    "license":           "LGPL",
                    "class name":        "videotestsrc",
                    "author":            "Nicolas Bouillot"
                }
            ]
        }
    },

    quiddities: function () {
        return {
            "quiddities": [
                {
                    "name":        "pulsesink1",
                    "class":       "pulsesink",
                    "category":    "audio",
                    "long name":   "Audio Display (Pulse)",
                    "description": "Inspecting Devices And Playing Audio To Outputs",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "name":        "audiotestsrc0",
                    "class":       "audiotestsrc",
                    "category":    "audio",
                    "long name":   "Sine",
                    "description": "Creates audio test signals",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "name":        "systemusage",
                    "class":       "systemusage",
                    "category":    "SystemUsage",
                    "long name":   "SystemUsage plugin",
                    "description": "Gives system load information",
                    "license":     "LGPL",
                    "author":      "Emmanuel Durand"
                },
                {
                    "name":        "defaultrtp",
                    "class":       "rtpsession",
                    "category":    "network",
                    "long name":   "RTP Session",
                    "description": "RTP session manager",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "name":        "soap",
                    "class":       "SOAPcontrolServer",
                    "category":    "control server",
                    "long name":   "Switcher Web Controler (SOAP)",
                    "description": "getting switcher controled through SOAP webservices",
                    "license":     "GPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "name":        "create_remove_spy",
                    "class":       "create_remove_spy",
                    "category":    "spy",
                    "long name":   "Quiddity Creation Inspector",
                    "description": "spy manager for quidity creation and removal and convert into signals",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "name":        "internal_logger",
                    "class":       "logger",
                    "category":    "log",
                    "long name":   "Switcher Logger",
                    "description": "manage switcher logs and other glib log domains.",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                }
            ]
        }
    },

    quiddities_public: function () {
        return {
            "quiddities": [
                {
                    "name":        "pulsesink1",
                    "class":       "pulsesink",
                    "category":    "audio",
                    "long name":   "Audio Display (Pulse)",
                    "description": "Inspecting Devices And Playing Audio To Outputs",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "name":        "audiotestsrc0",
                    "class":       "audiotestsrc",
                    "category":    "audio",
                    "long name":   "Sine",
                    "description": "Creates audio test signals",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "name":        "defaultrtp",
                    "class":       "rtpsession",
                    "category":    "network",
                    "long name":   "RTP Session",
                    "description": "RTP session manager",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                }
            ]
        }
    },

    tree: function () {
        return {
            "shmdata": {
                "max_reader": "1",
                "reader":     {
                    "/tmp/switcher_nodeserver_audiotestsrc0_audio": {
                        "category": "audio",
                        "caps":     "audio/x-raw-int, width=(int)16, endianness=(int)1234, signed=(boolean)true, depth=(int)16, rate=(int)44100, channels=(int)1"
                    }
                }
            }
        }
    },

    class: function () {
        return {
            "long name":         "Sine",
            "category":          "audio",
            "short description": "Creates audio test signals",
            "license":           "LGPL",
            "class name":        "audiotestsrc",
            "author":            "Nicolas Bouillot"
        }
    },

    class_parsed: function () {
        return {
            "name":        "Sine",
            "category":    "audio",
            "description": "Creates audio test signals",
            "license":     "LGPL",
            "class":       "audiotestsrc",
            "id":          "audiotestsrc",
            "author":      "Nicolas Bouillot"
        }
    },

    quiddity: function () {
        return {
            "name":        "audiotestsrc3",
            "class":       "audiotestsrc",
            "category":    "audio",
            "long name":   "Sine",
            "description": "Creates audio test signals",
            "license":     "LGPL",
            "author":      "Nicolas Bouillot"
        }
    },

    quiddity_parsed: function () {
        return {
            "id":          "audiotestsrc3",
            "class":       "audiotestsrc",
            "category":    "audio",
            "name":        "Sine",
            "description": "Creates audio test signals",
            "license":     "LGPL",
            "author":      "Nicolas Bouillot"
        }
    },

    quiddity_private: function () {
        return {
            "name" : "systemusage",
            "class" : "systemusage",
            "category" : "SystemUsage",
            "long name" : "SystemUsage plugin",
            "description" : "Gives system load information",
            "license" : "LGPL",
            "author" : "Emmanuel Durand"
        }
    },

    properties: function () {
        return {
            "properties": [
                {
                    "long name":         "Started",
                    "name":              "started",
                    "short description": "started or not",
                    "position category": "",
                    "position weight":   0,
                    "writable":          "true",
                    "type":              "boolean",
                    "default value":     "false"
                },
                {
                    "long name":         "Volume",
                    "name":              "volume",
                    "short description": "Volume of test signal",
                    "position category": "",
                    "position weight":   20,
                    "writable":          "true",
                    "type":              "double",
                    "minimum":           "0",
                    "maximum":           "1",
                    "default value":     "0.8"
                },
                {
                    "long name":         "Frequency",
                    "name":              "freq",
                    "short description": "Frequency of test signal",
                    "position category": "",
                    "position weight":   40,
                    "writable":          "true",
                    "type":              "double",
                    "minimum":           "0",
                    "maximum":           "20000",
                    "default value":     "440"
                },
                {
                    "long name":         "Signal Form",
                    "name":              "wave",
                    "short description": "Oscillator waveform",
                    "position category": "",
                    "position weight":   60,
                    "writable":          "true",
                    "type":              "enum",
                    "default value":     {
                        "value": "0",
                        "nick":  "sine",
                        "name":  "Sine"
                    },
                    "values":            [
                        {
                            "name":  "Sine",
                            "nick":  "sine",
                            "value": "0"
                        },
                        {
                            "name":  "Square",
                            "nick":  "square",
                            "value": "1"
                        },
                        {
                            "name":  "Saw",
                            "nick":  "saw",
                            "value": "2"
                        },
                        {
                            "name":  "Triangle",
                            "nick":  "triangle",
                            "value": "3"
                        },
                        {
                            "name":  "Silence",
                            "nick":  "silence",
                            "value": "4"
                        },
                        {
                            "name":  "White uniform noise",
                            "nick":  "white-noise",
                            "value": "5"
                        },
                        {
                            "name":  "Pink noise",
                            "nick":  "pink-noise",
                            "value": "6"
                        },
                        {
                            "name":  "Sine table",
                            "nick":  "sine-table",
                            "value": "7"
                        },
                        {
                            "name":  "Periodic Ticks",
                            "nick":  "ticks",
                            "value": "8"
                        },
                        {
                            "name":  "White Gaussian noise",
                            "nick":  "gaussian-noise",
                            "value": "9"
                        },
                        {
                            "name":  "Red (brownian) noise",
                            "nick":  "red-noise",
                            "value": "10"
                        },
                        {
                            "name":  "Blue noise",
                            "nick":  "blue-noise",
                            "value": "11"
                        },
                        {
                            "name":  "Violet noise",
                            "nick":  "violet-noise",
                            "value": "12"
                        }
                    ]
                }
            ]
        }
    },

    property_bool: function () {
        return {
            "long name":         "Started",
            "name":              "started",
            "short description": "started or not",
            "position category": "",
            "position weight":   0,
            "writable":          "true",
            "type":              "boolean",
            "default value":     "false"
        }
    },

    property_bool_parsed: function () {
        return {
            "name":        "Started",
            "id":          "started",
            "description": "started or not",
            "order":       0,
            "writable":    "true",
            "type":        "boolean",
            "value":       false,
            "default":     false
        }
    },

    property_double: function () {
        return {
            "long name":         "Volume",
            "name":              "volume",
            "short description": "Volume of test signal",
            "position category": "",
            "position weight":   20,
            "writable":          "true",
            "type":              "double",
            "minimum":           "0",
            "maximum":           "1",
            "default value":     "0.8"
        }
    },

    property_double_parsed: function () {
        return {
            "name":        "Volume",
            "id":          "volume",
            "description": "Volume of test signal",
            "order":       20,
            "writable":    "true",
            "type":        "double",
            "minimum":     0,
            "maximum":     1,
            "default":     0.8,
            "value":       0.8
        }
    },

    property_float: function () {
        return {
            "long name":         "Volume",
            "name":              "volume",
            "short description": "Volume of test signal",
            "position category": "",
            "position weight":   20,
            "writable":          "true",
            "type":              "float",
            "minimum":           "0",
            "maximum":           "1",
            "default value":     "0.8"
        }
    },

    property_float_parsed: function () {
        return {
            "name":        "Volume",
            "id":          "volume",
            "description": "Volume of test signal",
            "order":       20,
            "writable":    "true",
            "type":        "float",
            "minimum":     0,
            "maximum":     1,
            "default":     0.8,
            "value":       0.8
        }
    },

    property_int: function () {
        return {
            "long name":         "Volume",
            "name":              "volume",
            "short description": "Volume of test signal",
            "position category": "",
            "position weight":   20,
            "writable":          "true",
            "type":              "int",
            "minimum":           "0",
            "maximum":           "10",
            "default value":     "8"
        }
    },

    property_int_parsed: function () {
        return {
            "name":        "Volume",
            "id":          "volume",
            "description": "Volume of test signal",
            "order":       20,
            "writable":    "true",
            "type":        "int",
            "minimum":     0,
            "maximum":     10,
            "default":     8,
            "value":       8
        }
    },

    property_uint: function () {
        return {
            "long name":         "Volume",
            "name":              "volume",
            "short description": "Volume of test signal",
            "position category": "",
            "position weight":   20,
            "writable":          "true",
            "type":              "uint",
            "minimum":           "0",
            "maximum":           "10",
            "default value":     "8"
        }
    },

    property_uint_parsed: function () {
        return {
            "name":        "Volume",
            "id":          "volume",
            "description": "Volume of test signal",
            "order":       20,
            "writable":    "true",
            "type":        "uint",
            "minimum":     0,
            "maximum":     10,
            "default":     8,
            "value":       8
        }
    },

    property_string_json: function () {
        return {
            "long name":         "Destinations",
            "name":              "destinations-json",
            "short description": "json formated description of destinations",
            "position category": "",
            "position weight":   140,
            "writable":          "false",
            "type":              "string",
            "default value":     "{\n  \"destinations\" : [\n  ]\n}"
        }
    },

    property_string_json_parsed: function () {
        return {
            "name":        "Destinations",
            "id":          "destinations-json",
            "description": "json formated description of destinations",
            "order":       140,
            "writable":    "false",
            "type":        "string",
            "default":     {
                "destinations": []
            },
            "value":       {
                "destinations": []
            }
        }
    },

    property_string: function () {
        return {
            "long name":         "Destinations",
            "name":              "destinations-json",
            "short description": "json formated description of destinations",
            "position category": "",
            "position weight":   140,
            "writable":          "false",
            "type":              "string",
            "default value":     "some default value"
        }
    },

    property_string_parsed: function () {
        return {
            "name":        "Destinations",
            "id":          "destinations-json",
            "description": "json formated description of destinations",
            "order":       140,
            "writable":    "false",
            "type":        "string",
            "default":     "some default value",
            "value":       "some default value"
        }
    },

    property_enum: function () {
        return {
            "long name":         "mode",
            "name":              "mode",
            "short description": "Mode",
            "position category": "",
            "position weight":   160,
            "writable":          "true",
            "type":              "enum",
            "default value":     {
                "value": "0",
                "nick":  "vbr",
                "name":  "Variable Bit Rate (VBR) mode"
            },
            "values":            [
                {
                    "name":  "Variable Bit Rate (VBR) mode",
                    "nick":  "vbr",
                    "value": "0"
                },
                {
                    "name":  "Constant Bit Rate (CBR) mode",
                    "nick":  "cbr",
                    "value": "1"
                }
            ]
        }
    },

    property_enum_parsed: function () {
        return {
            "name":        "mode",
            "id":          "mode",
            "description": "Mode",
            "order":       160,
            "writable":    "true",
            "type":        "enum",
            "default":     "vbr",
            "value":       "vbr",
            "options":     [
                {
                    "name":  "Variable Bit Rate (VBR) mode",
                    "value": "vbr",
                    "id":    0
                },
                {
                    "name":  "Constant Bit Rate (CBR) mode",
                    "value": "cbr",
                    "id":    1
                }
            ]
        }
    },

    methods: function() {
        return {
            "methods" : [
                {
                    "long name" : "To Shmdata",
                    "name" : "to_shmdata",
                    "description" : "get streams from sdp description over http, accept also base64 encoded SDP string",
                    "position category" : "",
                    "position weight" : 0,
                    "return type" : "gboolean",
                    "return description" : "success or fail",
                    "arguments" : [
                        {
                            "long name" : "URL",
                            "name" : "url",
                            "description" : "URL to the sdp file, or a base64 encoded SDP description",
                            "type" : "gchararray"
                        }
                    ]
                }
            ]
        }
    },

    method: function () {
        return {
            "long name":          "Write SDP File",
            "name":               "write_sdp_file",
            "description":        "print sdp for the given destination",
            "position category":  "",
            "position weight":    120,
            "return type":        "gboolean",
            "return description": "success or fail",
            "arguments":          [
                {
                    "long name":   "Destination",
                    "name":        "name",
                    "description": "the name of the destination",
                    "type":        "gchararray"
                }
            ]
        }
    },

    method_parsed: function () {
        return {
            "name":              "Write SDP File",
            "id":                "write_sdp_file",
            "description":       "print sdp for the given destination",
            "order":             120,
            "returnType":        "gboolean",
            "returnDescription": "success or fail",
            "args":              [
                {
                    "name":        "Destination",
                    "id":          "name",
                    "description": "the name of the destination",
                    "type":        "gchararray"
                }
            ]
        }
    },

    shmdata_writers: function () {
        return {
            "/tmp/switcher_nodeserver_audiotestsrc0_audio": {
                "category": "audio",
                "caps":     "audio/x-raw-int, width=(int)16, endianness=(int)1234, signed=(boolean)true, depth=(int)16, rate=(int)44100, channels=(int)1"
            }
        }
    },

    shmdata_writer: function () {
        return {
            "category": "audio",
            "caps":     "audio/x-raw-int, width=(int)16, endianness=(int)1234, signed=(boolean)true, depth=(int)16, rate=(int)44100, channels=(int)1"
        }
    },

    shmdata_readers: function () {
        return {
            "/tmp/switcher_nodeserver_audiotestsrc0_audio": {
                "category": "audio",
                "caps":     "audio/x-raw-int, width=(int)16, endianness=(int)1234, signed=(boolean)true, depth=(int)16, rate=(int)44100, channels=(int)1"
            }
        }
    },

    shmdata_reader: function () {
        return {
            "category": "audio",
            "caps":     "audio/x-raw-int, width=(int)16, endianness=(int)1234, signed=(boolean)true, depth=(int)16, rate=(int)44100, channels=(int)1"
        }
    },

    destinations_json: function() {
        return {
            "destinations" : [
                {
                    "name" : "destination name",
                    "host_name" : "localhost",
                    "data_streams" : [
                        {
                            "path" : "/tmp/switcher_nodeserver_audiotestsrc1_audio",
                            "port" : "9090"
                        }
                    ]
                }
            ]
        }
    }

};