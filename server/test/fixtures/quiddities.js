module.exports = {

    systemusage_class: {
        "long name":         "SystemUsage plugin",
        "category":          "SystemUsage",
        "short description": "Gives system load information",
        "license":           "LGPL",
        "class name":        "systemusage",
        "author":            "Emmanuel Durand"
    },

    systemusage_class_parsed: {
        "name":        "SystemUsage plugin",
        "category":    "SystemUsage",
        "description": "Gives system load information",
        "license":     "LGPL",
        "class":       "systemusage",
        "id":          "systemusage",
        "author":      "Emmanuel Durand"
    },

    systemysage: {
        "name":        "systemusage",
        "class":       "systemusage",
        "category":    "SystemUsage",
        "long name":   "SystemUsage plugin",
        "description": "Gives system load information",
        "license":     "LGPL",
        "author":      "Emmanuel Durand"
    },

    audiotestsrc_class: {
        "long name":         "Sine",
        "category":          "audio",
        "short description": "Creates audio test signals",
        "license":           "LGPL",
        "class name":        "audiotestsrc",
        "author":            "Nicolas Bouillot"
    },

    audiotestsrc_class_parsed: {
        "name":        "Sine",
        "category":    "audio",
        "description": "Creates audio test signals",
        "license":     "LGPL",
        "class":       "audiotestsrc",
        "id":          "audiotestsrc",
        "author":      "Nicolas Bouillot"
    },

    audiotestsrc: {
        "name":        "audiotestsrc3",
        "class":       "audiotestsrc",
        "category":    "audio",
        "long name":   "Sine",
        "description": "Creates audio test signals",
        "license":     "LGPL",
        "author":      "Nicolas Bouillot"
    },

    audiotestsrc_parsed: {
        "id":          "audiotestsrc3",
        "class":       "audiotestsrc",
        "category":    "audio",
        "name":        "Sine",
        "description": "Creates audio test signals",
        "license":     "LGPL",
        "author":      "Nicolas Bouillot"
    },

    audiotestsrc_properties: {
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
    },

    property_bool: {
        "long name":         "Started",
        "name":              "started",
        "short description": "started or not",
        "position category": "",
        "position weight":   0,
        "writable":          "true",
        "type":              "boolean",
        "default value":     "false"
    },

    property_bool_parsed: {
        "name":        "Started",
        "id":          "started",
        "description": "started or not",
        "order":       0,
        "writable":    "true",
        "type":        "boolean",
        "value":       false,
        "default":     false
    },

    property_double: {
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

    property_double_parsed: {
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
    },

    property_float: {
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
    },

    property_float_parsed: {
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
    },

    property_int: {
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
    },

    property_int_parsed: {
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
    },

    property_uint: {
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
    },

    property_uint_parsed: {
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
    },

    property_string_json: {
        "long name":         "Destinations",
        "name":              "destinations-json",
        "short description": "json formated description of destinations",
        "position category": "",
        "position weight":   140,
        "writable":          "false",
        "type":              "string",
        "default value":     "{\n  \"destinations\" : [\n  ]\n}"
    },

    property_string_json_parsed: {
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
    },

    property_string: {
        "long name":         "Destinations",
        "name":              "destinations-json",
        "short description": "json formated description of destinations",
        "position category": "",
        "position weight":   140,
        "writable":          "false",
        "type":              "string",
        "default value":     "some default value"
    },

    property_string_parsed: {
        "name":        "Destinations",
        "id":          "destinations-json",
        "description": "json formated description of destinations",
        "order":       140,
        "writable":    "false",
        "type":        "string",
        "default":     "some default value",
        "value":       "some default value"
    },

    property_enum: {
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
    },

    property_enum_parsed: {
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
    },

    method: {
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
    },

    method_parsed: {
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
    },

    shmdata_writers: {
        "/tmp/switcher_nodeserver_audiotestsrc0_audio": {
            "category": "audio",
            "caps":     "audio/x-raw-int, width=(int)16, endianness=(int)1234, signed=(boolean)true, depth=(int)16, rate=(int)44100, channels=(int)1"
        }
    },

    shmdata_writer: {
        "category": "audio",
        "caps":     "audio/x-raw-int, width=(int)16, endianness=(int)1234, signed=(boolean)true, depth=(int)16, rate=(int)44100, channels=(int)1"
    },

    shmdata_readers: {
        "/tmp/switcher_nodeserver_audiotestsrc0_audio": {
            "category": "audio",
            "caps":     "audio/x-raw-int, width=(int)16, endianness=(int)1234, signed=(boolean)true, depth=(int)16, rate=(int)44100, channels=(int)1"
        }
    },

    shmdata_reader: {
        "category": "audio",
        "caps":     "audio/x-raw-int, width=(int)16, endianness=(int)1234, signed=(boolean)true, depth=(int)16, rate=(int)44100, channels=(int)1"
    }

};