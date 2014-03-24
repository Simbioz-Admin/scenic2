{
  "history" : [
    {
      "command" : "create_nick_named",
      "calling time" : 559256,
      "arguments" : [
        "rtpsession",
        "defaultrtp"
      ],
      "vector argument" : [
      ],
      "results" : [
        "defaultrtp"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 563318,
      "arguments" : [
        "SOAPcontrolServer",
        "soap"
      ],
      "vector argument" : [
      ],
      "results" : [
        "soap"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 564308,
      "arguments" : [
        "soap",
        "set_port"
      ],
      "vector argument" : [
        "8085"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 564776,
      "arguments" : [
        "dico",
        "dico"
      ],
      "vector argument" : [
      ],
      "results" : [
        "dico"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 565430,
      "arguments" : [
        "dico",
        "new-entry"
      ],
      "vector argument" : [
        "controlProperties",
        "stock informations about properties controlable by controlers (midi, osc, etc..)",
        "Properties of Quidds for Controls"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 565594,
      "arguments" : [
        "dico",
        "new-entry"
      ],
      "vector argument" : [
        "destinations",
        "stock informations about destinations for manage edition",
        "dico for manage destinations"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "set_property",
      "calling time" : 565687,
      "arguments" : [
        "dico",
        "destinations",
        "[]"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 566616,
      "arguments" : [
        "defaultrtp"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"defaultrtp\",\n  \"class\" : \"rtpsession\",\n  \"category\" : \"network\",\n  \"long name\" : \"RTP Session\",\n  \"description\" : \"RTP session manager\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 567064,
      "arguments" : [
        "soap"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"soap\",\n  \"class\" : \"SOAPcontrolServer\",\n  \"category\" : \"control server\",\n  \"long name\" : \"Switcher Web Controler (SOAP)\",\n  \"description\" : \"getting switcher controled through SOAP webservices\",\n  \"license\" : \"GPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 567337,
      "arguments" : [
        "dico"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"dico\",\n  \"class\" : \"dico\",\n  \"category\" : \"dictionary\",\n  \"long name\" : \"Dictionary\",\n  \"description\" : \"Dictionary of string key/values accessible through properties\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_classes_doc",
      "calling time" : 1894724,
      "arguments" : [
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"classes\" : [\n    {\n      \"long name\" : \"Switcher OSC Controler\",\n      \"category\" : \"control server\",\n      \"short description\" : \"OSCcontrolServer allows for managing switcher through OSC\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"OSCctl\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"OSC message to property\",\n      \"category\" : \"network converter\",\n      \"short description\" : \"OSCprop reveives OSC messages and updates associated property\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"OSCprop\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Switcher Web Client (SOAP)\",\n      \"category\" : \"control client\",\n      \"short description\" : \"controling a switcher instance through SOAP webservices\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"SOAPcontrolClient\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Switcher Web Controler (SOAP)\",\n      \"category\" : \"control server\",\n      \"short description\" : \"getting switcher controled through SOAP webservices\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"SOAPcontrolServer\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"AAC encoder\",\n      \"category\" : \"audio encoder\",\n      \"short description\" : \"AAC encoder (2 channels max)\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"aacenc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Audio Test\",\n      \"category\" : \"audio source\",\n      \"short description\" : \"Creates audio test signals\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"audiotestsrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Quiddity Creation Inspector\",\n      \"category\" : \"spy\",\n      \"short description\" : \"spy manager for quidity creation and removal and convert into signals\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"create_remove_spy\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata Decoder\",\n      \"category\" : \"decodebin2\",\n      \"short description\" : \"connect to a shmdata, decode it and write decoded frames to shmdata(s)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"decoder\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Deinterleave\",\n      \"category\" : \"video converter\",\n      \"short description\" : \"connect to an audio shmdata and split channels to multiple shmdata(s)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"deinterleave\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Dictionary\",\n      \"category\" : \"dictionary\",\n      \"short description\" : \"Dictionary of string key/values accessible through properties\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"dico\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata From Software\",\n      \"category\" : \"fake source\",\n      \"short description\" : \"add a shmdata from an other software\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"fakeshmsrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata Inspector\",\n      \"category\" : \"fakesink sink\",\n      \"short description\" : \"fakesink for testing purpose\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"fakesink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"File SDP Receiver\",\n      \"category\" : \"network\",\n      \"short description\" : \"get raw stream from sdp file\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"filesdp\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"GenICam Camera\",\n      \"category\" : \"genicam video\",\n      \"short description\" : \"Genicam video source using the Aravis library\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"genicam\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"GStreamer Pipeline\",\n      \"category\" : \"source\",\n      \"short description\" : \"GStreamer (src) pipeline description to a *single* shmdata\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"gstsrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"GStreamer Video Pipeline\",\n      \"category\" : \"video source\",\n      \"short description\" : \"GStreamer (src) video pipeline description to a *single* shmdata\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"gstvideosrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Display\",\n      \"category\" : \"video sink\",\n      \"short description\" : \"Video window with fullscreen\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"gtkvideosink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"HTTP/SDP Receiver\",\n      \"category\" : \"network\",\n      \"short description\" : \"get raw stream from sdp file distributed with http\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"httpsdp\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"HTTP/SDP Decoder\",\n      \"category\" : \"network source\",\n      \"short description\" : \"decode an sdp-described stream deliver through http and make shmdatas\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"httpsdpdec\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Audio Display (with Jack Audio)\",\n      \"category\" : \"audio sink\",\n      \"short description\" : \"Audio display with minimal features\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"jacksink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Jack Audio\",\n      \"category\" : \"audio source\",\n      \"short description\" : \"get audio from jack\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"jacksrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"JPEG Encoder\",\n      \"category\" : \"video encoder\",\n      \"short description\" : \"JPEG encoder\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"jpegenc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Switcher Logger\",\n      \"category\" : \"log\",\n      \"short description\" : \"manage switcher logs and other glib log domains.\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"logger\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Midi (PortMidiSink)\",\n      \"category\" : \"midi sink\",\n      \"short description\" : \"shmdata to midi\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"midisink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Midi (PortMidi)\",\n      \"category\" : \"midi source\",\n      \"short description\" : \"midi to shmdata and properties\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"midisrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"My Plugin\",\n      \"category\" : \"test\",\n      \"short description\" : \"Creates a quiddity from a plugin\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"myplugin\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Switcher Property Mapper\",\n      \"category\" : \"mapper\",\n      \"short description\" : \"map two properties, one being slave of the other\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"property-mapper\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Play To Audio Device (Pulse)\",\n      \"category\" : \"audio sink\",\n      \"short description\" : \"Inspecting Devices And Playing Audio To Outputs\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"pulsesink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Audio Device Source (Pulse)\",\n      \"category\" : \"audio source\",\n      \"short description\" : \"Inspecting Devices And Getting Audio From Inputs\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"pulsesrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"RTP Session\",\n      \"category\" : \"network\",\n      \"short description\" : \"RTP session manager\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"rtpsession\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata File Player\",\n      \"category\" : \"shmdata file player\",\n      \"short description\" : \"play file(s) recorded with shmdatatofile\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"shmfromfile\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata Recorder\",\n      \"category\" : \"file recorder\",\n      \"short description\" : \"record shmdata(s) to file(s)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"shmtofile\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"UDP Sender\",\n      \"category\" : \"udp sink\",\n      \"short description\" : \"send data stream with udp\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"udpsink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Media Player (URI)\",\n      \"category\" : \"uri src\",\n      \"short description\" : \"decode an URI and writes to shmdata(s)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"uridecodebin\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Capture (with v4l2)\",\n      \"category\" : \"video source\",\n      \"short description\" : \"Discover and use v4l2 supported capture cards and cameras\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"v4l2src\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Rate\",\n      \"category\" : \"video converter\",\n      \"short description\" : \"Adjusts video frame rate (video/x-raw-yuv)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"videorate\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Display\",\n      \"category\" : \"video sink\",\n      \"short description\" : \"Video window with minimal features\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"videosink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Test\",\n      \"category\" : \"video source\",\n      \"short description\" : \"Creates a test video stream\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"videotestsrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Vorbis Encoder\",\n      \"category\" : \"audio encoder\",\n      \"short description\" : \"Vorbis encoder (up to 255 interleaved channels)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"vorbis\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"H264 Encoder\",\n      \"category\" : \"video encoder\",\n      \"short description\" : \"H264 encoder\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"x264enc\",\n      \"author\" : \"Nicolas Bouillot\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_quiddities_description",
      "calling time" : 1907026,
      "arguments" : [
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"quiddities\" : [\n    {\n      \"name\" : \"dico\",\n      \"class\" : \"dico\",\n      \"category\" : \"dictionary\",\n      \"long name\" : \"Dictionary\",\n      \"description\" : \"Dictionary of string key/values accessible through properties\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"soap\",\n      \"class\" : \"SOAPcontrolServer\",\n      \"category\" : \"control server\",\n      \"long name\" : \"Switcher Web Controler (SOAP)\",\n      \"description\" : \"getting switcher controled through SOAP webservices\",\n      \"license\" : \"GPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"defaultrtp\",\n      \"class\" : \"rtpsession\",\n      \"category\" : \"network\",\n      \"long name\" : \"RTP Session\",\n      \"description\" : \"RTP session manager\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"create_remove_spy\",\n      \"class\" : \"create_remove_spy\",\n      \"category\" : \"spy\",\n      \"long name\" : \"Quiddity Creation Inspector\",\n      \"description\" : \"spy manager for quidity creation and removal and convert into signals\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"internal_logger\",\n      \"class\" : \"logger\",\n      \"category\" : \"log\",\n      \"long name\" : \"Switcher Logger\",\n      \"description\" : \"manage switcher logs and other glib log domains.\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 1911554,
      "arguments" : [
        "dico",
        "destinations"
      ],
      "vector argument" : [
      ],
      "results" : [
        "[]"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 1918668,
      "arguments" : [
        "dico",
        "controlProperties"
      ],
      "vector argument" : [
      ],
      "results" : [
        null
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 4071896,
      "arguments" : [
        "audiotestsrc",
        "test"
      ],
      "vector argument" : [
      ],
      "results" : [
        "test"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 4075974,
      "arguments" : [
        "test"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"test\",\n  \"class\" : \"audiotestsrc\",\n  \"category\" : \"audio source\",\n  \"long name\" : \"Audio Test\",\n  \"description\" : \"Creates audio test signals\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 4077079,
      "arguments" : [
        "test"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"test\",\n  \"class\" : \"audiotestsrc\",\n  \"category\" : \"audio source\",\n  \"long name\" : \"Audio Test\",\n  \"description\" : \"Creates audio test signals\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "subscribe_signal",
      "calling time" : 4077403,
      "arguments" : [
        "signal_sub",
        "test",
        "on-property-added"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_signal",
      "calling time" : 4077617,
      "arguments" : [
        "signal_sub",
        "test",
        "on-property-removed"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_signal",
      "calling time" : 4077769,
      "arguments" : [
        "signal_sub",
        "test",
        "on-method-added"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_signal",
      "calling time" : 4077896,
      "arguments" : [
        "signal_sub",
        "test",
        "on-method-removed"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_signal",
      "calling time" : 4078001,
      "arguments" : [
        "signal_sub",
        "test",
        "on-connection-tried"
      ],
      "vector argument" : [
      ],
      "results" : [
        "false"
      ]
    },
    {
      "command" : "get_properties_description",
      "calling time" : 4078220,
      "arguments" : [
        "test"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 40,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Volume\",\n      \"name\" : \"volume\",\n      \"short description\" : \"Volume of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"1\",\n      \"default value\" : \"0.8\"\n    },\n    {\n      \"long name\" : \"Frequency\",\n      \"name\" : \"freq\",\n      \"short description\" : \"Frequency of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"20000\",\n      \"default value\" : \"440\"\n    },\n    {\n      \"long name\" : \"Signal Form\",\n      \"name\" : \"wave\",\n      \"short description\" : \"Oscillator waveform\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"sine\",\n        \"name\" : \"Sine\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"Sine\",\n          \"nick\" : \"sine\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"Square\",\n          \"nick\" : \"square\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"Saw\",\n          \"nick\" : \"saw\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Triangle\",\n          \"nick\" : \"triangle\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Silence\",\n          \"nick\" : \"silence\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"White uniform noise\",\n          \"nick\" : \"white-noise\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"Pink noise\",\n          \"nick\" : \"pink-noise\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"Sine table\",\n          \"nick\" : \"sine-table\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"Periodic Ticks\",\n          \"nick\" : \"ticks\",\n          \"value\" : \"8\"\n        },\n        {\n          \"name\" : \"White Gaussian noise\",\n          \"nick\" : \"gaussian-noise\",\n          \"value\" : \"9\"\n        },\n        {\n          \"name\" : \"Red (brownian) noise\",\n          \"nick\" : \"red-noise\",\n          \"value\" : \"10\"\n        },\n        {\n          \"name\" : \"Blue noise\",\n          \"nick\" : \"blue-noise\",\n          \"value\" : \"11\"\n        },\n        {\n          \"name\" : \"Violet noise\",\n          \"nick\" : \"violet-noise\",\n          \"value\" : \"12\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 4079863,
      "arguments" : [
        "prop_sub",
        "test",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 4080178,
      "arguments" : [
        "prop_sub",
        "test",
        "shmdata-readers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 4080372,
      "arguments" : [
        "prop_sub",
        "test",
        "started"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 4081626,
      "arguments" : [
        "prop_sub",
        "test",
        "volume"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 4081817,
      "arguments" : [
        "prop_sub",
        "test",
        "freq"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 4081970,
      "arguments" : [
        "prop_sub",
        "test",
        "wave"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 4083303,
      "arguments" : [
        "test",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n  ]\n}"
      ]
    },
    {
      "command" : "get_properties_description",
      "calling time" : 4089683,
      "arguments" : [
        "test"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 40,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Volume\",\n      \"name\" : \"volume\",\n      \"short description\" : \"Volume of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"1\",\n      \"default value\" : \"0.8\"\n    },\n    {\n      \"long name\" : \"Frequency\",\n      \"name\" : \"freq\",\n      \"short description\" : \"Frequency of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"20000\",\n      \"default value\" : \"440\"\n    },\n    {\n      \"long name\" : \"Signal Form\",\n      \"name\" : \"wave\",\n      \"short description\" : \"Oscillator waveform\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"sine\",\n        \"name\" : \"Sine\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"Sine\",\n          \"nick\" : \"sine\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"Square\",\n          \"nick\" : \"square\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"Saw\",\n          \"nick\" : \"saw\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Triangle\",\n          \"nick\" : \"triangle\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Silence\",\n          \"nick\" : \"silence\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"White uniform noise\",\n          \"nick\" : \"white-noise\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"Pink noise\",\n          \"nick\" : \"pink-noise\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"Sine table\",\n          \"nick\" : \"sine-table\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"Periodic Ticks\",\n          \"nick\" : \"ticks\",\n          \"value\" : \"8\"\n        },\n        {\n          \"name\" : \"White Gaussian noise\",\n          \"nick\" : \"gaussian-noise\",\n          \"value\" : \"9\"\n        },\n        {\n          \"name\" : \"Red (brownian) noise\",\n          \"nick\" : \"red-noise\",\n          \"value\" : \"10\"\n        },\n        {\n          \"name\" : \"Blue noise\",\n          \"nick\" : \"blue-noise\",\n          \"value\" : \"11\"\n        },\n        {\n          \"name\" : \"Violet noise\",\n          \"nick\" : \"violet-noise\",\n          \"value\" : \"12\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_methods_description",
      "calling time" : 4102214,
      "arguments" : [
        "test"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"methods\" : [\n  ]\n}"
      ]
    },
    {
      "command" : "set_property",
      "calling time" : 5064970,
      "arguments" : [
        "test",
        "started",
        "true"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 5068270,
      "arguments" : [
        "test",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n    {\n      \"path\" : \"/tmp/switcher_nodeserver_test_audio\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "remove",
      "calling time" : 5068424,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_test_audio"
      ],
      "vector argument" : [
      ],
      "results" : [
        "false"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 5068500,
      "arguments" : [
        "fakesink",
        "vumeter_/tmp/switcher_nodeserver_test_audio"
      ],
      "vector argument" : [
      ],
      "results" : [
        "vumeter_/tmp/switcher_nodeserver_test_audio"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 5069106,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_test_audio",
        "connect"
      ],
      "vector argument" : [
        "/tmp/switcher_nodeserver_test_audio"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 5069814,
      "arguments" : [
        "prop_sub",
        "vumeter_/tmp/switcher_nodeserver_test_audio",
        "byte-rate"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 5070224,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_test_audio"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"vumeter_/tmp/switcher_nodeserver_test_audio\",\n  \"class\" : \"fakesink\",\n  \"category\" : \"fakesink sink\",\n  \"long name\" : \"Shmdata Inspector\",\n  \"description\" : \"fakesink for testing purpose\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 6072920,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_test_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "unknown"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 6073477,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_test_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "unknown"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 6073951,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_test_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "unknown"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 6074265,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_test_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "unknown"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 6075786,
      "arguments" : [
        "testpulsesink"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 6076537,
      "arguments" : [
        "testpulsesink"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 17874,
      "arguments" : [
        "defaultrtp"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"defaultrtp\",\n  \"class\" : \"rtpsession\",\n  \"category\" : \"network\",\n  \"long name\" : \"RTP Session\",\n  \"description\" : \"RTP session manager\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 18445,
      "arguments" : [
        "soap"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"soap\",\n  \"class\" : \"SOAPcontrolServer\",\n  \"category\" : \"control server\",\n  \"long name\" : \"Switcher Web Controler (SOAP)\",\n  \"description\" : \"getting switcher controled through SOAP webservices\",\n  \"license\" : \"GPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 18995,
      "arguments" : [
        "dico"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"dico\",\n  \"class\" : \"dico\",\n  \"category\" : \"dictionary\",\n  \"long name\" : \"Dictionary\",\n  \"description\" : \"Dictionary of string key/values accessible through properties\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 19679,
      "arguments" : [
        "test"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"test\",\n  \"class\" : \"audiotestsrc\",\n  \"category\" : \"audio source\",\n  \"long name\" : \"Audio Test\",\n  \"description\" : \"Creates audio test signals\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 20396,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_test_audio"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"vumeter_/tmp/switcher_nodeserver_test_audio\",\n  \"class\" : \"fakesink\",\n  \"category\" : \"fakesink sink\",\n  \"long name\" : \"Shmdata Inspector\",\n  \"description\" : \"fakesink for testing purpose\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 22676,
      "arguments" : [
        "dico",
        "destinations"
      ],
      "vector argument" : [
      ],
      "results" : [
        "[]"
      ]
    },
    {
      "command" : "get_quiddities_description",
      "calling time" : 36383,
      "arguments" : [
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"quiddities\" : [\n    {\n      \"name\" : \"vumeter_/tmp/switcher_nodeserver_test_audio\",\n      \"class\" : \"fakesink\",\n      \"category\" : \"fakesink sink\",\n      \"long name\" : \"Shmdata Inspector\",\n      \"description\" : \"fakesink for testing purpose\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"test\",\n      \"class\" : \"audiotestsrc\",\n      \"category\" : \"audio source\",\n      \"long name\" : \"Audio Test\",\n      \"description\" : \"Creates audio test signals\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"dico\",\n      \"class\" : \"dico\",\n      \"category\" : \"dictionary\",\n      \"long name\" : \"Dictionary\",\n      \"description\" : \"Dictionary of string key/values accessible through properties\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"soap\",\n      \"class\" : \"SOAPcontrolServer\",\n      \"category\" : \"control server\",\n      \"long name\" : \"Switcher Web Controler (SOAP)\",\n      \"description\" : \"getting switcher controled through SOAP webservices\",\n      \"license\" : \"GPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"defaultrtp\",\n      \"class\" : \"rtpsession\",\n      \"category\" : \"network\",\n      \"long name\" : \"RTP Session\",\n      \"description\" : \"RTP session manager\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"create_remove_spy\",\n      \"class\" : \"create_remove_spy\",\n      \"category\" : \"spy\",\n      \"long name\" : \"Quiddity Creation Inspector\",\n      \"description\" : \"spy manager for quidity creation and removal and convert into signals\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"internal_logger\",\n      \"class\" : \"logger\",\n      \"category\" : \"log\",\n      \"long name\" : \"Switcher Logger\",\n      \"description\" : \"manage switcher logs and other glib log domains.\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_properties_description",
      "calling time" : 37158,
      "arguments" : [
        "test"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n    {\\n      \\\"path\\\" : \\\"/tmp/switcher_nodeserver_test_audio\\\"\\n    }\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 40,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"true\"\n    },\n    {\n      \"long name\" : \"Volume\",\n      \"name\" : \"volume\",\n      \"short description\" : \"Volume of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"1\",\n      \"default value\" : \"0.8\"\n    },\n    {\n      \"long name\" : \"Frequency\",\n      \"name\" : \"freq\",\n      \"short description\" : \"Frequency of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"20000\",\n      \"default value\" : \"440\"\n    },\n    {\n      \"long name\" : \"Signal Form\",\n      \"name\" : \"wave\",\n      \"short description\" : \"Oscillator waveform\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"sine\",\n        \"name\" : \"Sine\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"Sine\",\n          \"nick\" : \"sine\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"Square\",\n          \"nick\" : \"square\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"Saw\",\n          \"nick\" : \"saw\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Triangle\",\n          \"nick\" : \"triangle\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Silence\",\n          \"nick\" : \"silence\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"White uniform noise\",\n          \"nick\" : \"white-noise\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"Pink noise\",\n          \"nick\" : \"pink-noise\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"Sine table\",\n          \"nick\" : \"sine-table\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"Periodic Ticks\",\n          \"nick\" : \"ticks\",\n          \"value\" : \"8\"\n        },\n        {\n          \"name\" : \"White Gaussian noise\",\n          \"nick\" : \"gaussian-noise\",\n          \"value\" : \"9\"\n        },\n        {\n          \"name\" : \"Red (brownian) noise\",\n          \"nick\" : \"red-noise\",\n          \"value\" : \"10\"\n        },\n        {\n          \"name\" : \"Blue noise\",\n          \"nick\" : \"blue-noise\",\n          \"value\" : \"11\"\n        },\n        {\n          \"name\" : \"Violet noise\",\n          \"nick\" : \"violet-noise\",\n          \"value\" : \"12\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 38178,
      "arguments" : [
        "test",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n    {\n      \"path\" : \"/tmp/switcher_nodeserver_test_audio\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 38374,
      "arguments" : [
        "test",
        "shmdata-readers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_readers\" : [\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 38495,
      "arguments" : [
        "test",
        "started"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 38598,
      "arguments" : [
        "test",
        "volume"
      ],
      "vector argument" : [
      ],
      "results" : [
        "0.80000000000000004"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 38685,
      "arguments" : [
        "test",
        "freq"
      ],
      "vector argument" : [
      ],
      "results" : [
        "440"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 38772,
      "arguments" : [
        "test",
        "wave"
      ],
      "vector argument" : [
      ],
      "results" : [
        "Sine"
      ]
    },
    {
      "command" : "get_methods_description",
      "calling time" : 38857,
      "arguments" : [
        "test"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"methods\" : [\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 40347,
      "arguments" : [
        "dico",
        "destinations"
      ],
      "vector argument" : [
      ],
      "results" : [
        "[]"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 42589,
      "arguments" : [
        "test",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n    {\n      \"path\" : \"/tmp/switcher_nodeserver_test_audio\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 1048747,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_test_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "audio/x-raw-int, width=(int)16, endianness=(int)1234, signed=(boolean)true, depth=(int)16, rate=(int)44100, channels=(int)1"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 1049121,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_test_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "audio/x-raw-int, width=(int)16, endianness=(int)1234, signed=(boolean)true, depth=(int)16, rate=(int)44100, channels=(int)1"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 1050602,
      "arguments" : [
        "testpulsesink"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 1054867,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_test_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "audio/x-raw-int, width=(int)16, endianness=(int)1234, signed=(boolean)true, depth=(int)16, rate=(int)44100, channels=(int)1"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 1055148,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_test_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "audio/x-raw-int, width=(int)16, endianness=(int)1234, signed=(boolean)true, depth=(int)16, rate=(int)44100, channels=(int)1"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 1058991,
      "arguments" : [
        "testpulsesink"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 3625208,
      "arguments" : [
        "dico",
        "destinations"
      ],
      "vector argument" : [
      ],
      "results" : [
        "[]"
      ]
    },
    {
      "command" : "set_property",
      "calling time" : 3629557,
      "arguments" : [
        "dico",
        "destinations",
        "[{\"name\":\"pac\",\"hostName\":\"\",\"portSoap\":\"\",\"id\":\"pac\",\"data_streams\":[]}]"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 3631780,
      "arguments" : [
        "defaultrtp",
        "add_destination"
      ],
      "vector argument" : [
        "pac",
        null
      ],
      "results" : [
        "true"
      ]
    }
  ]
}