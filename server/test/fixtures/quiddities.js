module.exports = {

    classes_doc: function () {
        return {
            "classes": [
                {
                    "class":       "OSCctl",
                    "name":        "Switcher OSC Controler",
                    "category":    "control",
                    "tags":        [],
                    "description": "OSCcontrolServer allows for managing switcher through OSC",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "OSCsrc",
                    "name":        "OSC Receiver",
                    "category":    "network",
                    "tags":        [
                        "writer"
                    ],
                    "description": "receives OSC messages and write to shmdata",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "SOAPcontrolClient",
                    "name":        "Switcher Web Client (SOAP)",
                    "category":    "control",
                    "tags":        [],
                    "description": "controling a switcher instance through SOAP webservices",
                    "license":     "GPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "SOAPcontrolServer",
                    "name":        "Switcher Web Controler (SOAP)",
                    "category":    "control",
                    "tags":        [],
                    "description": "getting switcher controled through SOAP webservices",
                    "license":     "GPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "audiotestsrc",
                    "name":        "Sine",
                    "category":    "audio",
                    "tags":        [
                        "writer"
                    ],
                    "description": "Creates audio test signals",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "create_remove_spy",
                    "name":        "Quiddity Creation Inspector",
                    "category":    "utils",
                    "tags":        [],
                    "description": "spy manager for quidity creation and removal and convert into signals",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "dico",
                    "name":        "Dictionary",
                    "category":    "utils",
                    "tags":        [],
                    "description": "Dictionary of string key/values accessible through properties",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "dummy",
                    "name":        "Dummy Plugin",
                    "category":    "test",
                    "tags":        [],
                    "description": "Dummy plugin for testing/example purpose",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "extshmsrc",
                    "name":        "Raw Shmdata",
                    "category":    "other",
                    "tags":        [
                        "writer"
                    ],
                    "description": "import an external shmdata writer",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "gtkwin",
                    "name":        "Video Display (configurable)",
                    "category":    "video",
                    "tags":        [
                        "reader"
                    ],
                    "description": "Video window with fullscreen",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "httpsdpdec",
                    "name":        "HTTP/SDP Player",
                    "category":    "network",
                    "tags":        [
                        "writer"
                    ],
                    "description": "decode an sdp-described stream delivered through http and make shmdatas",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "jacksink",
                    "name":        "Audio Display (Jack)",
                    "category":    "audio",
                    "tags":        [
                        "reader"
                    ],
                    "description": "Audio display",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "jacksrc",
                    "name":        "Jack Audio Device",
                    "category":    "audio",
                    "tags":        [
                        "writer"
                    ],
                    "description": "get audio from jack",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "logger",
                    "name":        "Switcher Logger",
                    "category":    "utils",
                    "tags":        [],
                    "description": "manage switcher logs and other glib log domains.",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "property-mapper",
                    "name":        "Switcher Property Mapper",
                    "category":    "utils",
                    "tags":        [],
                    "description": "map two properties, one being slave of the other",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "rtpsession",
                    "name":        "RTP Session",
                    "category":    "network",
                    "tags":        [],
                    "description": "RTP session manager",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "shmOSCsink",
                    "name":        "OSC sender",
                    "category":    "network",
                    "tags":        [
                        "reader"
                    ],
                    "description": "shmOSCsink reveives OSC messages and updates associated property",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "sip",
                    "name":        "SIP (Session Initiation Protocol)",
                    "category":    "network",
                    "tags":        [
                        "writer"
                    ],
                    "description": "Manages user sessions",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "systemusage",
                    "name":        "SystemUsage plugin",
                    "category":    "monitoring",
                    "tags":        [],
                    "description": "Gives system load information",
                    "license":     "LGPL",
                    "author":      "Emmanuel Durand"
                },
                {
                    "class":       "urisrc",
                    "name":        "URI/URL Player",
                    "category":    "network",
                    "tags":        [
                        "writer"
                    ],
                    "description": "URI decoding to shmdatas",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "v4l2src",
                    "name":        "v4l2 Video Capture",
                    "category":    "video",
                    "tags":        [
                        "writer"
                    ],
                    "description": "Discover and use v4l2 supported capture cards and cameras",
                    "license":     "GPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "videotestsrc",
                    "name":        "Video Pattern",
                    "category":    "video",
                    "tags":        [
                        "writer"
                    ],
                    "description": "Creates a test video stream",
                    "license":     "LGPL",
                    "author":      "Nicolas Bouillot"
                },
                {
                    "class":       "vncclientsrc",
                    "name":        "VNC client",
                    "category":    "video",
                    "tags":        [
                        "writer"
                    ],
                    "description": "Connects to a VNC server and outputs the video to a shmdata",
                    "license":     "LGPL",
                    "author":      "Emmanuel Durand"
                }
            ]
        }
    },

    classes_doc_public: function () {
        return {
            "classes": [{
                class:       'OSCctl',
                name:        'Switcher OSC Controler',
                category:    'control',
                tags:        [],
                description: 'OSCcontrolServer allows for managing switcher through OSC',
                license:     'LGPL',
                author:      'Nicolas Bouillot'
            },
                        {
                            class:       'OSCsrc',
                            name:        'OSC Receiver',
                            category:    'network',
                            tags:        ['writer'],
                            description: 'receives OSC messages and write to shmdata',
                            license:     'LGPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'SOAPcontrolClient',
                            name:        'Switcher Web Client (SOAP)',
                            category:    'control',
                            tags:        [],
                            description: 'controling a switcher instance through SOAP webservices',
                            license:     'GPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'SOAPcontrolServer',
                            name:        'Switcher Web Controler (SOAP)',
                            category:    'control',
                            tags:        [],
                            description: 'getting switcher controled through SOAP webservices',
                            license:     'GPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'audiotestsrc',
                            name:        'Sine',
                            category:    'audio',
                            tags:        ['writer'],
                            description: 'Creates audio test signals',
                            license:     'LGPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'create_remove_spy',
                            name:        'Quiddity Creation Inspector',
                            category:    'utils',
                            tags:        [],
                            description: 'spy manager for quidity creation and removal and convert into signals',
                            license:     'LGPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'dico',
                            name:        'Dictionary',
                            category:    'utils',
                            tags:        [],
                            description: 'Dictionary of string key/values accessible through properties',
                            license:     'LGPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'dummy',
                            name:        'Dummy Plugin',
                            category:    'test',
                            tags:        [],
                            description: 'Dummy plugin for testing/example purpose',
                            license:     'LGPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'extshmsrc',
                            name:        'Raw Shmdata',
                            category:    'other',
                            tags:        ['writer'],
                            description: 'import an external shmdata writer',
                            license:     'LGPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'gtkwin',
                            name:        'Video Display (configurable)',
                            category:    'video',
                            tags:        ['reader'],
                            description: 'Video window with fullscreen',
                            license:     'LGPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'httpsdpdec',
                            name:        'HTTP/SDP Player',
                            category:    'network',
                            tags:        ['writer'],
                            description: 'decode an sdp-described stream delivered through http and make shmdatas',
                            license:     'LGPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'jacksink',
                            name:        'Audio Display (Jack)',
                            category:    'audio',
                            tags:        ['reader'],
                            description: 'Audio display',
                            license:     'LGPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'jacksrc',
                            name:        'Jack Audio Device',
                            category:    'audio',
                            tags:        ['writer'],
                            description: 'get audio from jack',
                            license:     'LGPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'logger',
                            name:        'Switcher Logger',
                            category:    'utils',
                            tags:        [],
                            description: 'manage switcher logs and other glib log domains.',
                            license:     'LGPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'property-mapper',
                            name:        'Switcher Property Mapper',
                            category:    'utils',
                            tags:        [],
                            description: 'map two properties, one being slave of the other',
                            license:     'LGPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'rtpsession',
                            name:        'RTP Session',
                            category:    'network',
                            tags:        [],
                            description: 'RTP session manager',
                            license:     'LGPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'shmOSCsink',
                            name:        'OSC sender',
                            category:    'network',
                            tags:        ['reader'],
                            description: 'shmOSCsink reveives OSC messages and updates associated property',
                            license:     'LGPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'sip',
                            name:        'SIP (Session Initiation Protocol)',
                            category:    'network',
                            tags:        ['writer'],
                            description: 'Manages user sessions',
                            license:     'LGPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'systemusage',
                            name:        'SystemUsage plugin',
                            category:    'monitoring',
                            tags:        [],
                            description: 'Gives system load information',
                            license:     'LGPL',
                            author:      'Emmanuel Durand'
                        },
                        {
                            class:       'urisrc',
                            name:        'URI/URL Player',
                            category:    'network',
                            tags:        ['writer'],
                            description: 'URI decoding to shmdatas',
                            license:     'LGPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'v4l2src',
                            name:        'v4l2 Video Capture',
                            category:    'video',
                            tags:        ['writer'],
                            description: 'Discover and use v4l2 supported capture cards and cameras',
                            license:     'GPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'videotestsrc',
                            name:        'Video Pattern',
                            category:    'video',
                            tags:        ['writer'],
                            description: 'Creates a test video stream',
                            license:     'LGPL',
                            author:      'Nicolas Bouillot'
                        },
                        {
                            class:       'vncclientsrc',
                            name:        'VNC client',
                            category:    'video',
                            tags:        ['writer'],
                            description: 'Connects to a VNC server and outputs the video to a shmdata',
                            license:     'LGPL',
                            author:      'Emmanuel Durand'
                        }]
        }

    },

    quiddities: function () {
        return {
            "quiddities": [
                {
                    "id":    "pulsesink1",
                    "class": "pulsesink"
                },
                {
                    "id":    "audiotestsrc0",
                    "class": "audiotestsrc"
                },
                {
                    "id":    "systemusage",
                    "class": "systemusage"
                },
                {
                    "id":    "defaultrtp",
                    "class": "rtpsession"
                },
                {
                    "id":    "soap",
                    "class": "SOAPcontrolServer"
                },
                {
                    "id":    "create_remove_spy",
                    "class": "create_remove_spy"
                },
                {
                    "id":    "internal_logger",
                    "class": "logger"
                }
            ]
        }
    },

    quiddities_public: function () {
        return {
            "quiddities": [
                {
                    "id":    "pulsesink1",
                    "class": "pulsesink"
                },
                {
                    "id":    "audiotestsrc0",
                    "class": "audiotestsrc"
                },
                {
                    "id":    "systemusage",
                    "class": "systemusage"
                },
                {
                    "id":    "defaultrtp",
                    "class": "rtpsession"
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

    quiddity: function () {
        return {
            "id":    "audiotestsrc3",
            "class": "audiotestsrc"
        }
    },

    quiddity_private: function () {
        return {
            "id":    "create_remove_spy",
            "class": "create_remove_spy"
        }
    },

    properties: function () {
        return {
            "properties": [
                {
                    "name":         "Started",
                    "id":              "started",
                    "description": "started or not",
                    "parent": "",
                    "order":   0,
                    "writable":          "true",
                    "type":              "boolean",
                    "default value":     "false"
                },
                {
                    "name":         "Volume",
                    "id":              "volume",
                    "description": "Volume of test signal",
                    "parent": "",
                    "order":   20,
                    "writable":          "true",
                    "type":              "double",
                    "minimum":           "0",
                    "maximum":           "1",
                    "default value":     "0.8"
                },
                {
                    "name":         "Frequency",
                    "id":              "freq",
                    "description": "Frequency of test signal",
                    "parent": "",
                    "order":   40,
                    "writable":          "true",
                    "type":              "double",
                    "minimum":           "0",
                    "maximum":           "20000",
                    "default value":     "440"
                },
                {
                    "name":         "Signal Form",
                    "id":              "wave",
                    "description": "Oscillator waveform",
                    "parent": "",
                    "order":   60,
                    "writable":          "true",
                    "type":              "enum",
                    "default value":     {
                        "value": "0",
                        "nick":  "sine",
                        "id":  "Sine"
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

    properties_parsed: function () {
        return [
            {
                "name":        "Started",
                "id":          "started",
                "description": "started or not",
                "parent": null,
                "order":       0,
                "writable":    true,
                "type":        "boolean",
                "default":     false,
                "value":       false
            },
            {
                "name":        "Volume",
                "id":          "volume",
                "description": "Volume of test signal",
                "parent": null,
                "order":       20,
                "writable":    true,
                "type":        "double",
                "minimum":     0,
                "maximum":     1,
                "default":     0.8,
                "value":       0.8
            },
            {
                "name":        "Frequency",
                "id":          "freq",
                "description": "Frequency of test signal",
                "parent": null,
                "order":       40,
                "writable":    true,
                "type":        "double",
                "minimum":     0,
                "maximum":     20000,
                "default":     440,
                "value":       440
            },
            {
                "name":        "Signal Form",
                "id":          "wave",
                "description": "Oscillator waveform",
                "parent": null,
                "order":       60,
                "writable":    true,
                "type":        "enum",
                "default":     "sine",
                "value":       "sine",
                "options":      [
                    {
                        "name":  "Sine",
                        "value": "sine",
                        "id":    0
                    },
                    {
                        "name":  "Square",
                        "value": "square",
                        "id":    1
                    },
                    {
                        "name":  "Saw",
                        "value": "saw",
                        "id":    2
                    },
                    {
                        "name":  "Triangle",
                        "value": "triangle",
                        "id":    3
                    },
                    {
                        "name":  "Silence",
                        "value": "silence",
                        "id":    4
                    },
                    {
                        "name":  "White uniform noise",
                        "value": "white-noise",
                        "id":    5
                    },
                    {
                        "name":  "Pink noise",
                        "value": "pink-noise",
                        "id":    6
                    },
                    {
                        "name":  "Sine table",
                        "value": "sine-table",
                        "id":    7
                    },
                    {
                        "name":  "Periodic Ticks",
                        "value": "ticks",
                        "id":    8
                    },
                    {
                        "name":  "White Gaussian noise",
                        "value": "gaussian-noise",
                        "id":    9
                    },
                    {
                        "name":  "Red (brownian) noise",
                        "value": "red-noise",
                        "id":    10
                    },
                    {
                        "name":  "Blue noise",
                        "value": "blue-noise",
                        "id":    11
                    },
                    {
                        "name":  "Violet noise",
                        "value": "violet-noise",
                        "id":    12
                    }
                ]
            }
        ]
    },

    property_bool: function () {
        return {
            "name":         "Started",
            "id":              "started",
            "description": "started or not",
            "parent": "",
            "order":   0,
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
            "parent": null,
            "order":       0,
            "writable":    true,
            "type":        "boolean",
            "value":       false,
            "default":     false
        }
    },

    property_double: function () {
        return {
            "name":         "Volume",
            "id":              "volume",
            "description": "Volume of test signal",
            "parent": "",
            "order":   20,
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
            "parent": null,
            "order":       20,
            "writable":    true,
            "type":        "double",
            "minimum":     0,
            "maximum":     1,
            "default":     0.8,
            "value":       0.8
        }
    },

    property_float: function () {
        return {
            "name":         "Volume",
            "id":              "volume",
            "description": "Volume of test signal",
            "parent": "",
            "order":   20,
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
            "parent": null,
            "order":       20,
            "writable":    true,
            "type":        "float",
            "minimum":     0,
            "maximum":     1,
            "default":     0.8,
            "value":       0.8
        }
    },

    property_int: function () {
        return {
            "name":         "Volume",
            "id":              "volume",
            "description": "Volume of test signal",
            "parent": "",
            "order":   20,
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
            "parent": null,
            "order":       20,
            "writable":    true,
            "type":        "int",
            "minimum":     0,
            "maximum":     10,
            "default":     8,
            "value":       8
        }
    },

    property_uint: function () {
        return {
            "name":         "Volume",
            "id":              "volume",
            "description": "Volume of test signal",
            "parent": "",
            "order":   20,
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
            "parent": null,
            "order":       20,
            "writable":    true,
            "type":        "uint",
            "minimum":     0,
            "maximum":     10,
            "default":     8,
            "value":       8
        }
    },

    property_string_json: function () {
        return {
            "name":         "Destinations",
            "id":              "destinations-json",
            "description": "json formated description of destinations",
            "parent": "",
            "order":   140,
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
            "parent": null,
            "order":       140,
            "writable":    false,
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
            "name":         "Destinations",
            "id":              "destinations-json",
            "description": "json formated description of destinations",
            "parent": "",
            "order":   140,
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
            "parent": null,
            "order":       140,
            "writable":    false,
            "type":        "string",
            "default":     "some default value",
            "value":       "some default value"
        }
    },

    property_enum: function () {
        return {
            "name":         "mode",
            "id":              "mode",
            "description": "Mode",
            "parent": "",
            "order":   160,
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
            "parent": null,
            "order":       160,
            "writable":    true,
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

    methods: function () {
        return {
            "methods": [
                {
                    "name":          "To Shmdata",
                    "id":               "to_shmdata",
                    "description":        "get streams from sdp description over http, accept also base64 encoded SDP string",
                    "parent":  "",
                    "order":    0,
                    "return type":        "gboolean",
                    "return description": "success or fail",
                    "arguments":          [
                        {
                            "long name":   "URL",
                            "name":        "url",
                            "description": "URL to the sdp file, or a base64 encoded SDP description",
                            "type":        "gchararray"
                        }
                    ]
                }
            ]
        }
    },

    methods_parsed: function () {
        return [
            {
                "name":              "To Shmdata",
                "id":                "to_shmdata",
                "description":       "get streams from sdp description over http, accept also base64 encoded SDP string",
                "parent": null,
                "order":             0,
                "returnType":        "gboolean",
                "returnDescription": "success or fail",
                "args":         [
                    {
                        "name":        "URL",
                        "id":          "url",
                        "description": "URL to the sdp file, or a base64 encoded SDP description",
                        "type":        "gchararray"
                    }
                ]
            }
        ]
    },

    method: function () {
        return {
            "name":          "Write SDP File",
            "id":               "write_sdp_file",
            "description":        "print sdp for the given destination",
            "parent":  "",
            "order":    120,
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
            "parent": null,
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
                "category":  "audio",
                "caps":      "audio/x-raw-int, width=(int)16, endianness=(int)1234, signed=(boolean)true, depth=(int)16, rate=(int)44100, channels=(int)1",
                "byte_rate": "3600"
            }
        }
    },

    shmdata_writer: function () {
        return {
            "category":  "audio",
            "caps":      "audio/x-raw-int, width=(int)16, endianness=(int)1234, signed=(boolean)true, depth=(int)16, rate=(int)44100, channels=(int)1",
            "byte_rate": "3600"
        }
    },

    shmdata_writer_parsed: function () {
        return {
            "category":  "audio",
            "caps":      "audio/x-raw-int, width=(int)16, endianness=(int)1234, signed=(boolean)true, depth=(int)16, rate=(int)44100, channels=(int)1",
            "byte_rate": 3600
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

    destinations_json: function () {
        return {
            "destinations": [
                {
                    "name":         "destination 1 name",
                    "host_name":    "localhost",
                    "data_streams": [
                        {
                            "path": "/tmp/switcher_nodeserver_audiotestsrc0_audio",
                            "port": "9090"
                        },
                        {
                            "path": "/tmp/switcher_nodeserver_audiotestsrc1_audio",
                            "port": "9092"
                        }
                    ]
                },
                {
                    "name":         "destination 2 name",
                    "host_name":    "localhost",
                    "data_streams": [
                        {
                            "path": "/tmp/switcher_nodeserver_audiotestsrc2_audio",
                            "port": "9094"
                        }
                    ]
                }
            ]
        }
    },

    contacts: function () {
        return {
            "0": {
                "status":             "online",
                "status_text":        "On The Phone",
                "subscription_state": "ACTIVE",
                "uri":                "1001@10.10.30.247",
                "send_status":        "disconnected",
                "recv_status":        "disconnected",
                "name":               "1001"
            },
            "1": {
                "status":             "online",
                "status_text":        "On The Phone",
                "subscription_state": "ACTIVE",
                "uri":                "1005@10.10.30.247",
                "send_status":        "calling",
                "recv_status":        "disconnected",
                "name":               "1005@10.10.30.247"
            },
            "2": {
                "status":             "online",
                "status_text":        "Talk 1001",
                "subscription_state": "ACTIVE",
                "uri":                "1002@10.10.30.247",
                "send_status":        "calling",
                "recv_status":        "disconnected",
                "name":               "1002@10.10.30.247",
                "connections":        [
                    "/tmp/switcher_scenic8000_audiotestsrc0_audio",
                    "/tmp/switcher_scenic8000_audiotestsrc1_audio"
                ]
            },
            "3": {
                "status":             "online",
                "status_text":        "Talk 1001",
                "subscription_state": "ACTIVE",
                "uri":                "1003@10.10.30.247",
                "send_status":        "disconnected",
                "recv_status":        "disconnected",
                "name":               "1003@10.10.30.247",
                "connections":        [
                    "/tmp/switcher_scenic8000_audiotestsrc0_audio",
                    "/tmp/switcher_scenic8000_audiotestsrc1_audio"
                ]
            },
            "4": {
                "status":             "online",
                "status_text":        "On The Phone",
                "subscription_state": "ACTIVE",
                "uri":                "1006@10.10.30.247",
                "send_status":        "disconnected",
                "recv_status":        "disconnected",
                "name":               "1006@10.10.30.247"
            }
        }
    },

    contacts_parsed: function () {
        return [
            {
                "status":             "online",
                "status_text":        "On The Phone",
                "subscription_state": "ACTIVE",
                "id":                 "1001@10.10.30.247",
                "uri":                "1001@10.10.30.247",
                "send_status":        "disconnected",
                "recv_status":        "disconnected",
                "name":               "1001",
                "self":               true
            },
            {
                "status":             "online",
                "status_text":        "On The Phone",
                "subscription_state": "ACTIVE",
                "id":                 "1005@10.10.30.247",
                "uri":                "1005@10.10.30.247",
                "send_status":        "calling",
                "recv_status":        "disconnected",
                "name":               "1005@10.10.30.247",
                "self":               false
            },
            {
                "status":             "online",
                "status_text":        "Talk 1001",
                "subscription_state": "ACTIVE",
                "id":                 "1002@10.10.30.247",
                "uri":                "1002@10.10.30.247",
                "send_status":        "calling",
                "recv_status":        "disconnected",
                "name":               "1002@10.10.30.247",
                "self":               false,
                "connections":        [
                    "/tmp/switcher_scenic8000_audiotestsrc0_audio",
                    "/tmp/switcher_scenic8000_audiotestsrc1_audio"
                ]
            },
            {
                "status":             "online",
                "status_text":        "Talk 1001",
                "subscription_state": "ACTIVE",
                "id":                 "1003@10.10.30.247",
                "uri":                "1003@10.10.30.247",
                "send_status":        "disconnected",
                "recv_status":        "disconnected",
                "name":               "1003@10.10.30.247",
                "self":               false,
                "connections":        [
                    "/tmp/switcher_scenic8000_audiotestsrc0_audio",
                    "/tmp/switcher_scenic8000_audiotestsrc1_audio"
                ]
            },
            {
                "status":             "online",
                "status_text":        "On The Phone",
                "subscription_state": "ACTIVE",
                "id":                 "1006@10.10.30.247",
                "uri":                "1006@10.10.30.247",
                "send_status":        "disconnected",
                "recv_status":        "disconnected",
                "name":               "1006@10.10.30.247",
                "self":               false
            }
        ]
    },

    contact: function () {
        return {
            uri: 'buddy@sip.server'
        }
    },

    contact_parsed: function () {
        return {
            id:   'buddy@sip.server',
            uri:  'buddy@sip.server'
        }
    },

    mapper: function() {
        return {
            'id': 'property-mapper0',
            'class': 'property-mapper'
        }
    }

};