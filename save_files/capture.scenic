{
  "history" : [
    {
      "command" : "create_nick_named",
      "calling time" : 567662,
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
      "calling time" : 571759,
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
      "calling time" : 572512,
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
      "calling time" : 572727,
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
      "calling time" : 572997,
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
      "calling time" : 573097,
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
      "calling time" : 573182,
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
      "calling time" : 574077,
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
      "calling time" : 574551,
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
      "calling time" : 574732,
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
      "calling time" : 1900034,
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
      "calling time" : 1914680,
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
      "calling time" : 1919199,
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
      "calling time" : 1925365,
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
      "calling time" : 10067467,
      "arguments" : [
        "audiotestsrc",
        "audio 1"
      ],
      "vector argument" : [
      ],
      "results" : [
        "audio 1"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 10071666,
      "arguments" : [
        "audio 1"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"audio 1\",\n  \"class\" : \"audiotestsrc\",\n  \"category\" : \"audio source\",\n  \"long name\" : \"Audio Test\",\n  \"description\" : \"Creates audio test signals\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 10072740,
      "arguments" : [
        "audio 1"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"audio 1\",\n  \"class\" : \"audiotestsrc\",\n  \"category\" : \"audio source\",\n  \"long name\" : \"Audio Test\",\n  \"description\" : \"Creates audio test signals\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "subscribe_signal",
      "calling time" : 10073051,
      "arguments" : [
        "signal_sub",
        "audio 1",
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
      "calling time" : 10073265,
      "arguments" : [
        "signal_sub",
        "audio 1",
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
      "calling time" : 10073477,
      "arguments" : [
        "signal_sub",
        "audio 1",
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
      "calling time" : 10073646,
      "arguments" : [
        "signal_sub",
        "audio 1",
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
      "calling time" : 10073813,
      "arguments" : [
        "signal_sub",
        "audio 1",
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
      "calling time" : 10074080,
      "arguments" : [
        "audio 1"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 40,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Volume\",\n      \"name\" : \"volume\",\n      \"short description\" : \"Volume of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"1\",\n      \"default value\" : \"0.8\"\n    },\n    {\n      \"long name\" : \"Frequency\",\n      \"name\" : \"freq\",\n      \"short description\" : \"Frequency of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"20000\",\n      \"default value\" : \"440\"\n    },\n    {\n      \"long name\" : \"Signal Form\",\n      \"name\" : \"wave\",\n      \"short description\" : \"Oscillator waveform\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"sine\",\n        \"name\" : \"Sine\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"Sine\",\n          \"nick\" : \"sine\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"Square\",\n          \"nick\" : \"square\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"Saw\",\n          \"nick\" : \"saw\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Triangle\",\n          \"nick\" : \"triangle\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Silence\",\n          \"nick\" : \"silence\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"White uniform noise\",\n          \"nick\" : \"white-noise\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"Pink noise\",\n          \"nick\" : \"pink-noise\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"Sine table\",\n          \"nick\" : \"sine-table\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"Periodic Ticks\",\n          \"nick\" : \"ticks\",\n          \"value\" : \"8\"\n        },\n        {\n          \"name\" : \"White Gaussian noise\",\n          \"nick\" : \"gaussian-noise\",\n          \"value\" : \"9\"\n        },\n        {\n          \"name\" : \"Red (brownian) noise\",\n          \"nick\" : \"red-noise\",\n          \"value\" : \"10\"\n        },\n        {\n          \"name\" : \"Blue noise\",\n          \"nick\" : \"blue-noise\",\n          \"value\" : \"11\"\n        },\n        {\n          \"name\" : \"Violet noise\",\n          \"nick\" : \"violet-noise\",\n          \"value\" : \"12\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 10075299,
      "arguments" : [
        "prop_sub",
        "audio 1",
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
      "calling time" : 10075550,
      "arguments" : [
        "prop_sub",
        "audio 1",
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
      "calling time" : 10076820,
      "arguments" : [
        "prop_sub",
        "audio 1",
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
      "calling time" : 10077003,
      "arguments" : [
        "prop_sub",
        "audio 1",
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
      "calling time" : 10077147,
      "arguments" : [
        "prop_sub",
        "audio 1",
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
      "calling time" : 10077282,
      "arguments" : [
        "prop_sub",
        "audio 1",
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
      "calling time" : 10078502,
      "arguments" : [
        "audio 1",
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
      "calling time" : 10085386,
      "arguments" : [
        "audio 1"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 40,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Volume\",\n      \"name\" : \"volume\",\n      \"short description\" : \"Volume of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"1\",\n      \"default value\" : \"0.8\"\n    },\n    {\n      \"long name\" : \"Frequency\",\n      \"name\" : \"freq\",\n      \"short description\" : \"Frequency of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"20000\",\n      \"default value\" : \"440\"\n    },\n    {\n      \"long name\" : \"Signal Form\",\n      \"name\" : \"wave\",\n      \"short description\" : \"Oscillator waveform\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"sine\",\n        \"name\" : \"Sine\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"Sine\",\n          \"nick\" : \"sine\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"Square\",\n          \"nick\" : \"square\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"Saw\",\n          \"nick\" : \"saw\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Triangle\",\n          \"nick\" : \"triangle\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Silence\",\n          \"nick\" : \"silence\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"White uniform noise\",\n          \"nick\" : \"white-noise\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"Pink noise\",\n          \"nick\" : \"pink-noise\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"Sine table\",\n          \"nick\" : \"sine-table\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"Periodic Ticks\",\n          \"nick\" : \"ticks\",\n          \"value\" : \"8\"\n        },\n        {\n          \"name\" : \"White Gaussian noise\",\n          \"nick\" : \"gaussian-noise\",\n          \"value\" : \"9\"\n        },\n        {\n          \"name\" : \"Red (brownian) noise\",\n          \"nick\" : \"red-noise\",\n          \"value\" : \"10\"\n        },\n        {\n          \"name\" : \"Blue noise\",\n          \"nick\" : \"blue-noise\",\n          \"value\" : \"11\"\n        },\n        {\n          \"name\" : \"Violet noise\",\n          \"nick\" : \"violet-noise\",\n          \"value\" : \"12\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_methods_description",
      "calling time" : 10097984,
      "arguments" : [
        "audio 1"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"methods\" : [\n  ]\n}"
      ]
    },
    {
      "command" : "set_property",
      "calling time" : 11635342,
      "arguments" : [
        "audio 1",
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
      "calling time" : 11639445,
      "arguments" : [
        "audio 1",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n    {\n      \"path\" : \"/tmp/switcher_nodeserver_audio 1_audio\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "remove",
      "calling time" : 11639662,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audio 1_audio"
      ],
      "vector argument" : [
      ],
      "results" : [
        "false"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 11639772,
      "arguments" : [
        "fakesink",
        "vumeter_/tmp/switcher_nodeserver_audio 1_audio"
      ],
      "vector argument" : [
      ],
      "results" : [
        "vumeter_/tmp/switcher_nodeserver_audio 1_audio"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 11640434,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audio 1_audio",
        "connect"
      ],
      "vector argument" : [
        "/tmp/switcher_nodeserver_audio 1_audio"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 11641156,
      "arguments" : [
        "prop_sub",
        "vumeter_/tmp/switcher_nodeserver_audio 1_audio",
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
      "calling time" : 11641623,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audio 1_audio"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"vumeter_/tmp/switcher_nodeserver_audio 1_audio\",\n  \"class\" : \"fakesink\",\n  \"category\" : \"fakesink sink\",\n  \"long name\" : \"Shmdata Inspector\",\n  \"description\" : \"fakesink for testing purpose\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 12646741,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audio 1_audio",
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
      "calling time" : 12647277,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audio 1_audio",
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
      "calling time" : 12647938,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audio 1_audio",
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
      "calling time" : 12648290,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audio 1_audio",
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
      "calling time" : 12649052,
      "arguments" : [
        "audio 1pulsesink"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 12649718,
      "arguments" : [
        "audio 1pulsesink"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 16617936,
      "arguments" : [
        "audiotestsrc",
        "audio 2"
      ],
      "vector argument" : [
      ],
      "results" : [
        "audio 2"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 16619752,
      "arguments" : [
        "audio 2"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"audio 2\",\n  \"class\" : \"audiotestsrc\",\n  \"category\" : \"audio source\",\n  \"long name\" : \"Audio Test\",\n  \"description\" : \"Creates audio test signals\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 16621652,
      "arguments" : [
        "audio 2"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"audio 2\",\n  \"class\" : \"audiotestsrc\",\n  \"category\" : \"audio source\",\n  \"long name\" : \"Audio Test\",\n  \"description\" : \"Creates audio test signals\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "subscribe_signal",
      "calling time" : 16621971,
      "arguments" : [
        "signal_sub",
        "audio 2",
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
      "calling time" : 16622172,
      "arguments" : [
        "signal_sub",
        "audio 2",
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
      "calling time" : 16622374,
      "arguments" : [
        "signal_sub",
        "audio 2",
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
      "calling time" : 16622515,
      "arguments" : [
        "signal_sub",
        "audio 2",
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
      "calling time" : 16622648,
      "arguments" : [
        "signal_sub",
        "audio 2",
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
      "calling time" : 16622873,
      "arguments" : [
        "audio 2"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 40,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Volume\",\n      \"name\" : \"volume\",\n      \"short description\" : \"Volume of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"1\",\n      \"default value\" : \"0.8\"\n    },\n    {\n      \"long name\" : \"Frequency\",\n      \"name\" : \"freq\",\n      \"short description\" : \"Frequency of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"20000\",\n      \"default value\" : \"440\"\n    },\n    {\n      \"long name\" : \"Signal Form\",\n      \"name\" : \"wave\",\n      \"short description\" : \"Oscillator waveform\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"sine\",\n        \"name\" : \"Sine\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"Sine\",\n          \"nick\" : \"sine\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"Square\",\n          \"nick\" : \"square\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"Saw\",\n          \"nick\" : \"saw\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Triangle\",\n          \"nick\" : \"triangle\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Silence\",\n          \"nick\" : \"silence\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"White uniform noise\",\n          \"nick\" : \"white-noise\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"Pink noise\",\n          \"nick\" : \"pink-noise\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"Sine table\",\n          \"nick\" : \"sine-table\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"Periodic Ticks\",\n          \"nick\" : \"ticks\",\n          \"value\" : \"8\"\n        },\n        {\n          \"name\" : \"White Gaussian noise\",\n          \"nick\" : \"gaussian-noise\",\n          \"value\" : \"9\"\n        },\n        {\n          \"name\" : \"Red (brownian) noise\",\n          \"nick\" : \"red-noise\",\n          \"value\" : \"10\"\n        },\n        {\n          \"name\" : \"Blue noise\",\n          \"nick\" : \"blue-noise\",\n          \"value\" : \"11\"\n        },\n        {\n          \"name\" : \"Violet noise\",\n          \"nick\" : \"violet-noise\",\n          \"value\" : \"12\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 16623848,
      "arguments" : [
        "prop_sub",
        "audio 2",
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
      "calling time" : 16624024,
      "arguments" : [
        "prop_sub",
        "audio 2",
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
      "calling time" : 16624190,
      "arguments" : [
        "prop_sub",
        "audio 2",
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
      "calling time" : 16624364,
      "arguments" : [
        "prop_sub",
        "audio 2",
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
      "calling time" : 16624539,
      "arguments" : [
        "prop_sub",
        "audio 2",
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
      "calling time" : 16624677,
      "arguments" : [
        "prop_sub",
        "audio 2",
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
      "calling time" : 16625175,
      "arguments" : [
        "audio 2",
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
      "calling time" : 16625844,
      "arguments" : [
        "audio 2"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 40,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Volume\",\n      \"name\" : \"volume\",\n      \"short description\" : \"Volume of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"1\",\n      \"default value\" : \"0.8\"\n    },\n    {\n      \"long name\" : \"Frequency\",\n      \"name\" : \"freq\",\n      \"short description\" : \"Frequency of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"20000\",\n      \"default value\" : \"440\"\n    },\n    {\n      \"long name\" : \"Signal Form\",\n      \"name\" : \"wave\",\n      \"short description\" : \"Oscillator waveform\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"sine\",\n        \"name\" : \"Sine\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"Sine\",\n          \"nick\" : \"sine\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"Square\",\n          \"nick\" : \"square\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"Saw\",\n          \"nick\" : \"saw\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Triangle\",\n          \"nick\" : \"triangle\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Silence\",\n          \"nick\" : \"silence\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"White uniform noise\",\n          \"nick\" : \"white-noise\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"Pink noise\",\n          \"nick\" : \"pink-noise\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"Sine table\",\n          \"nick\" : \"sine-table\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"Periodic Ticks\",\n          \"nick\" : \"ticks\",\n          \"value\" : \"8\"\n        },\n        {\n          \"name\" : \"White Gaussian noise\",\n          \"nick\" : \"gaussian-noise\",\n          \"value\" : \"9\"\n        },\n        {\n          \"name\" : \"Red (brownian) noise\",\n          \"nick\" : \"red-noise\",\n          \"value\" : \"10\"\n        },\n        {\n          \"name\" : \"Blue noise\",\n          \"nick\" : \"blue-noise\",\n          \"value\" : \"11\"\n        },\n        {\n          \"name\" : \"Violet noise\",\n          \"nick\" : \"violet-noise\",\n          \"value\" : \"12\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_methods_description",
      "calling time" : 16640256,
      "arguments" : [
        "audio 2"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"methods\" : [\n  ]\n}"
      ]
    },
    {
      "command" : "set_property",
      "calling time" : 17997330,
      "arguments" : [
        "audio 2",
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
      "calling time" : 17999272,
      "arguments" : [
        "audio 2",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n    {\n      \"path\" : \"/tmp/switcher_nodeserver_audio 2_audio\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "remove",
      "calling time" : 17999374,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audio 2_audio"
      ],
      "vector argument" : [
      ],
      "results" : [
        "false"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 17999414,
      "arguments" : [
        "fakesink",
        "vumeter_/tmp/switcher_nodeserver_audio 2_audio"
      ],
      "vector argument" : [
      ],
      "results" : [
        "vumeter_/tmp/switcher_nodeserver_audio 2_audio"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 17999971,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audio 2_audio",
        "connect"
      ],
      "vector argument" : [
        "/tmp/switcher_nodeserver_audio 2_audio"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 18000463,
      "arguments" : [
        "prop_sub",
        "vumeter_/tmp/switcher_nodeserver_audio 2_audio",
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
      "calling time" : 18000825,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audio 2_audio"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"vumeter_/tmp/switcher_nodeserver_audio 2_audio\",\n  \"class\" : \"fakesink\",\n  \"category\" : \"fakesink sink\",\n  \"long name\" : \"Shmdata Inspector\",\n  \"description\" : \"fakesink for testing purpose\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 19003198,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audio 2_audio",
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
      "calling time" : 19003351,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audio 2_audio",
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
      "calling time" : 19004126,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audio 2_audio",
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
      "calling time" : 19004209,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audio 2_audio",
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
      "calling time" : 19006111,
      "arguments" : [
        "audio 2pulsesink"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 19006429,
      "arguments" : [
        "audio 2pulsesink"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 25306855,
      "arguments" : [
        "videotestsrc",
        "video 1"
      ],
      "vector argument" : [
      ],
      "results" : [
        "video 1"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 25314032,
      "arguments" : [
        "video 1"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"video 1\",\n  \"class\" : \"videotestsrc\",\n  \"category\" : \"video source\",\n  \"long name\" : \"Video Test\",\n  \"description\" : \"Creates a test video stream\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 25315343,
      "arguments" : [
        "video 1"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"video 1\",\n  \"class\" : \"videotestsrc\",\n  \"category\" : \"video source\",\n  \"long name\" : \"Video Test\",\n  \"description\" : \"Creates a test video stream\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "subscribe_signal",
      "calling time" : 25315604,
      "arguments" : [
        "signal_sub",
        "video 1",
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
      "calling time" : 25315794,
      "arguments" : [
        "signal_sub",
        "video 1",
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
      "calling time" : 25315995,
      "arguments" : [
        "signal_sub",
        "video 1",
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
      "calling time" : 25316169,
      "arguments" : [
        "signal_sub",
        "video 1",
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
      "calling time" : 25316316,
      "arguments" : [
        "signal_sub",
        "video 1",
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
      "calling time" : 25316525,
      "arguments" : [
        "video 1"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 40,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Video Codecs (Short List)\",\n      \"name\" : \"codec\",\n      \"short description\" : \"Codec Short List\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"None\",\n        \"name\" : \"None\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"None\",\n          \"nick\" : \"None\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"YUV4MPEG video encoder\",\n          \"nick\" : \"y4menc\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"On2 VP8 Encoder\",\n          \"nick\" : \"vp8enc\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Theora video encoder\",\n          \"nick\" : \"theoraenc\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Smoke video encoder\",\n          \"nick\" : \"smokeenc\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"Dirac Encoder\",\n          \"nick\" : \"schroenc\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"PNM image encoder\",\n          \"nick\" : \"pnmenc\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"PNG image encoder\",\n          \"nick\" : \"pngenc\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"JPEG image encoder\",\n          \"nick\" : \"jpegenc\",\n          \"value\" : \"8\"\n        }\n      ]\n    },\n    {\n      \"long name\" : \"More Codecs\",\n      \"name\" : \"more_codecs\",\n      \"short description\" : \"Get More codecs\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Video Pattern\",\n      \"name\" : \"pattern\",\n      \"short description\" : \"Type of test pattern to generate\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"smpte\",\n        \"name\" : \"SMPTE 100% color bars\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"SMPTE 100% color bars\",\n          \"nick\" : \"smpte\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"Random (television snow)\",\n          \"nick\" : \"snow\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"100% Black\",\n          \"nick\" : \"black\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"100% White\",\n          \"nick\" : \"white\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Red\",\n          \"nick\" : \"red\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"Green\",\n          \"nick\" : \"green\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"Blue\",\n          \"nick\" : \"blue\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"Checkers 1px\",\n          \"nick\" : \"checkers-1\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"Checkers 2px\",\n          \"nick\" : \"checkers-2\",\n          \"value\" : \"8\"\n        },\n        {\n          \"name\" : \"Checkers 4px\",\n          \"nick\" : \"checkers-4\",\n          \"value\" : \"9\"\n        },\n        {\n          \"name\" : \"Checkers 8px\",\n          \"nick\" : \"checkers-8\",\n          \"value\" : \"10\"\n        },\n        {\n          \"name\" : \"Circular\",\n          \"nick\" : \"circular\",\n          \"value\" : \"11\"\n        },\n        {\n          \"name\" : \"Blink\",\n          \"nick\" : \"blink\",\n          \"value\" : \"12\"\n        },\n        {\n          \"name\" : \"SMPTE 75% color bars\",\n          \"nick\" : \"smpte75\",\n          \"value\" : \"13\"\n        },\n        {\n          \"name\" : \"Zone plate\",\n          \"nick\" : \"zone-plate\",\n          \"value\" : \"14\"\n        },\n        {\n          \"name\" : \"Gamut checkers\",\n          \"nick\" : \"gamut\",\n          \"value\" : \"15\"\n        },\n        {\n          \"name\" : \"Chroma zone plate\",\n          \"nick\" : \"chroma-zone-plate\",\n          \"value\" : \"16\"\n        },\n        {\n          \"name\" : \"Solid color\",\n          \"nick\" : \"solid-color\",\n          \"value\" : \"17\"\n        },\n        {\n          \"name\" : \"Moving ball\",\n          \"nick\" : \"ball\",\n          \"value\" : \"18\"\n        },\n        {\n          \"name\" : \"SMPTE 100% color bars\",\n          \"nick\" : \"smpte100\",\n          \"value\" : \"19\"\n        },\n        {\n          \"name\" : \"Bar\",\n          \"nick\" : \"bar\",\n          \"value\" : \"20\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 25317758,
      "arguments" : [
        "prop_sub",
        "video 1",
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
      "calling time" : 25317988,
      "arguments" : [
        "prop_sub",
        "video 1",
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
      "calling time" : 25318122,
      "arguments" : [
        "prop_sub",
        "video 1",
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
      "calling time" : 25318265,
      "arguments" : [
        "prop_sub",
        "video 1",
        "codec"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 25318400,
      "arguments" : [
        "prop_sub",
        "video 1",
        "more_codecs"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 25318524,
      "arguments" : [
        "prop_sub",
        "video 1",
        "pattern"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 25318988,
      "arguments" : [
        "video 1",
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
      "calling time" : 25320921,
      "arguments" : [
        "video 1"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 40,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Video Codecs (Short List)\",\n      \"name\" : \"codec\",\n      \"short description\" : \"Codec Short List\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"None\",\n        \"name\" : \"None\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"None\",\n          \"nick\" : \"None\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"YUV4MPEG video encoder\",\n          \"nick\" : \"y4menc\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"On2 VP8 Encoder\",\n          \"nick\" : \"vp8enc\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Theora video encoder\",\n          \"nick\" : \"theoraenc\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Smoke video encoder\",\n          \"nick\" : \"smokeenc\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"Dirac Encoder\",\n          \"nick\" : \"schroenc\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"PNM image encoder\",\n          \"nick\" : \"pnmenc\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"PNG image encoder\",\n          \"nick\" : \"pngenc\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"JPEG image encoder\",\n          \"nick\" : \"jpegenc\",\n          \"value\" : \"8\"\n        }\n      ]\n    },\n    {\n      \"long name\" : \"More Codecs\",\n      \"name\" : \"more_codecs\",\n      \"short description\" : \"Get More codecs\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Video Pattern\",\n      \"name\" : \"pattern\",\n      \"short description\" : \"Type of test pattern to generate\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"smpte\",\n        \"name\" : \"SMPTE 100% color bars\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"SMPTE 100% color bars\",\n          \"nick\" : \"smpte\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"Random (television snow)\",\n          \"nick\" : \"snow\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"100% Black\",\n          \"nick\" : \"black\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"100% White\",\n          \"nick\" : \"white\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Red\",\n          \"nick\" : \"red\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"Green\",\n          \"nick\" : \"green\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"Blue\",\n          \"nick\" : \"blue\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"Checkers 1px\",\n          \"nick\" : \"checkers-1\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"Checkers 2px\",\n          \"nick\" : \"checkers-2\",\n          \"value\" : \"8\"\n        },\n        {\n          \"name\" : \"Checkers 4px\",\n          \"nick\" : \"checkers-4\",\n          \"value\" : \"9\"\n        },\n        {\n          \"name\" : \"Checkers 8px\",\n          \"nick\" : \"checkers-8\",\n          \"value\" : \"10\"\n        },\n        {\n          \"name\" : \"Circular\",\n          \"nick\" : \"circular\",\n          \"value\" : \"11\"\n        },\n        {\n          \"name\" : \"Blink\",\n          \"nick\" : \"blink\",\n          \"value\" : \"12\"\n        },\n        {\n          \"name\" : \"SMPTE 75% color bars\",\n          \"nick\" : \"smpte75\",\n          \"value\" : \"13\"\n        },\n        {\n          \"name\" : \"Zone plate\",\n          \"nick\" : \"zone-plate\",\n          \"value\" : \"14\"\n        },\n        {\n          \"name\" : \"Gamut checkers\",\n          \"nick\" : \"gamut\",\n          \"value\" : \"15\"\n        },\n        {\n          \"name\" : \"Chroma zone plate\",\n          \"nick\" : \"chroma-zone-plate\",\n          \"value\" : \"16\"\n        },\n        {\n          \"name\" : \"Solid color\",\n          \"nick\" : \"solid-color\",\n          \"value\" : \"17\"\n        },\n        {\n          \"name\" : \"Moving ball\",\n          \"nick\" : \"ball\",\n          \"value\" : \"18\"\n        },\n        {\n          \"name\" : \"SMPTE 100% color bars\",\n          \"nick\" : \"smpte100\",\n          \"value\" : \"19\"\n        },\n        {\n          \"name\" : \"Bar\",\n          \"nick\" : \"bar\",\n          \"value\" : \"20\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_methods_description",
      "calling time" : 25329880,
      "arguments" : [
        "video 1"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"methods\" : [\n  ]\n}"
      ]
    },
    {
      "command" : "set_property",
      "calling time" : 26792575,
      "arguments" : [
        "video 1",
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
      "calling time" : 26799195,
      "arguments" : [
        "video 1",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n    {\n      \"path\" : \"/tmp/switcher_nodeserver_video 1_video\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "remove",
      "calling time" : 26799432,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_video 1_video"
      ],
      "vector argument" : [
      ],
      "results" : [
        "false"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 26799536,
      "arguments" : [
        "fakesink",
        "vumeter_/tmp/switcher_nodeserver_video 1_video"
      ],
      "vector argument" : [
      ],
      "results" : [
        "vumeter_/tmp/switcher_nodeserver_video 1_video"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 26800745,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_video 1_video",
        "connect"
      ],
      "vector argument" : [
        "/tmp/switcher_nodeserver_video 1_video"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 26802046,
      "arguments" : [
        "prop_sub",
        "vumeter_/tmp/switcher_nodeserver_video 1_video",
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
      "calling time" : 26802558,
      "arguments" : [
        "codec"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "unsubscribe_property",
      "calling time" : 26802813,
      "arguments" : [
        "prop_sub",
        "video 1",
        "codec"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 26802917,
      "arguments" : [
        "more_codecs"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "unsubscribe_property",
      "calling time" : 26803107,
      "arguments" : [
        "prop_sub",
        "video 1",
        "more_codecs"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 26803358,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_video 1_video"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"vumeter_/tmp/switcher_nodeserver_video 1_video\",\n  \"class\" : \"fakesink\",\n  \"category\" : \"fakesink sink\",\n  \"long name\" : \"Shmdata Inspector\",\n  \"description\" : \"fakesink for testing purpose\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 27806132,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_video 1_video",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "video/x-raw-yuv, format=(fourcc)YUY2, color-matrix=(string)sdtv, chroma-site=(string)mpeg2, width=(int)320, height=(int)240, framerate=(fraction)30/1"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 27806442,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_video 1_video",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "video/x-raw-yuv, format=(fourcc)YUY2, color-matrix=(string)sdtv, chroma-site=(string)mpeg2, width=(int)320, height=(int)240, framerate=(fraction)30/1"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 27807642,
      "arguments" : [
        "video 1gtkvideosink"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 32585532,
      "arguments" : [
        "videotestsrc",
        "video 2"
      ],
      "vector argument" : [
      ],
      "results" : [
        "video 2"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 32587508,
      "arguments" : [
        "video 2"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"video 2\",\n  \"class\" : \"videotestsrc\",\n  \"category\" : \"video source\",\n  \"long name\" : \"Video Test\",\n  \"description\" : \"Creates a test video stream\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 32588683,
      "arguments" : [
        "video 2"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"video 2\",\n  \"class\" : \"videotestsrc\",\n  \"category\" : \"video source\",\n  \"long name\" : \"Video Test\",\n  \"description\" : \"Creates a test video stream\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "subscribe_signal",
      "calling time" : 32588952,
      "arguments" : [
        "signal_sub",
        "video 2",
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
      "calling time" : 32589119,
      "arguments" : [
        "signal_sub",
        "video 2",
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
      "calling time" : 32589279,
      "arguments" : [
        "signal_sub",
        "video 2",
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
      "calling time" : 32589434,
      "arguments" : [
        "signal_sub",
        "video 2",
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
      "calling time" : 32589559,
      "arguments" : [
        "signal_sub",
        "video 2",
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
      "calling time" : 32589744,
      "arguments" : [
        "video 2"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 40,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Video Codecs (Short List)\",\n      \"name\" : \"codec\",\n      \"short description\" : \"Codec Short List\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"None\",\n        \"name\" : \"None\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"None\",\n          \"nick\" : \"None\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"YUV4MPEG video encoder\",\n          \"nick\" : \"y4menc\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"On2 VP8 Encoder\",\n          \"nick\" : \"vp8enc\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Theora video encoder\",\n          \"nick\" : \"theoraenc\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Smoke video encoder\",\n          \"nick\" : \"smokeenc\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"Dirac Encoder\",\n          \"nick\" : \"schroenc\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"PNM image encoder\",\n          \"nick\" : \"pnmenc\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"PNG image encoder\",\n          \"nick\" : \"pngenc\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"JPEG image encoder\",\n          \"nick\" : \"jpegenc\",\n          \"value\" : \"8\"\n        }\n      ]\n    },\n    {\n      \"long name\" : \"More Codecs\",\n      \"name\" : \"more_codecs\",\n      \"short description\" : \"Get More codecs\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Video Pattern\",\n      \"name\" : \"pattern\",\n      \"short description\" : \"Type of test pattern to generate\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"smpte\",\n        \"name\" : \"SMPTE 100% color bars\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"SMPTE 100% color bars\",\n          \"nick\" : \"smpte\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"Random (television snow)\",\n          \"nick\" : \"snow\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"100% Black\",\n          \"nick\" : \"black\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"100% White\",\n          \"nick\" : \"white\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Red\",\n          \"nick\" : \"red\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"Green\",\n          \"nick\" : \"green\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"Blue\",\n          \"nick\" : \"blue\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"Checkers 1px\",\n          \"nick\" : \"checkers-1\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"Checkers 2px\",\n          \"nick\" : \"checkers-2\",\n          \"value\" : \"8\"\n        },\n        {\n          \"name\" : \"Checkers 4px\",\n          \"nick\" : \"checkers-4\",\n          \"value\" : \"9\"\n        },\n        {\n          \"name\" : \"Checkers 8px\",\n          \"nick\" : \"checkers-8\",\n          \"value\" : \"10\"\n        },\n        {\n          \"name\" : \"Circular\",\n          \"nick\" : \"circular\",\n          \"value\" : \"11\"\n        },\n        {\n          \"name\" : \"Blink\",\n          \"nick\" : \"blink\",\n          \"value\" : \"12\"\n        },\n        {\n          \"name\" : \"SMPTE 75% color bars\",\n          \"nick\" : \"smpte75\",\n          \"value\" : \"13\"\n        },\n        {\n          \"name\" : \"Zone plate\",\n          \"nick\" : \"zone-plate\",\n          \"value\" : \"14\"\n        },\n        {\n          \"name\" : \"Gamut checkers\",\n          \"nick\" : \"gamut\",\n          \"value\" : \"15\"\n        },\n        {\n          \"name\" : \"Chroma zone plate\",\n          \"nick\" : \"chroma-zone-plate\",\n          \"value\" : \"16\"\n        },\n        {\n          \"name\" : \"Solid color\",\n          \"nick\" : \"solid-color\",\n          \"value\" : \"17\"\n        },\n        {\n          \"name\" : \"Moving ball\",\n          \"nick\" : \"ball\",\n          \"value\" : \"18\"\n        },\n        {\n          \"name\" : \"SMPTE 100% color bars\",\n          \"nick\" : \"smpte100\",\n          \"value\" : \"19\"\n        },\n        {\n          \"name\" : \"Bar\",\n          \"nick\" : \"bar\",\n          \"value\" : \"20\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 32591049,
      "arguments" : [
        "prop_sub",
        "video 2",
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
      "calling time" : 32591264,
      "arguments" : [
        "prop_sub",
        "video 2",
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
      "calling time" : 32591446,
      "arguments" : [
        "prop_sub",
        "video 2",
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
      "calling time" : 32591627,
      "arguments" : [
        "prop_sub",
        "video 2",
        "codec"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 32591798,
      "arguments" : [
        "prop_sub",
        "video 2",
        "more_codecs"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 32591973,
      "arguments" : [
        "prop_sub",
        "video 2",
        "pattern"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 32592608,
      "arguments" : [
        "video 2",
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
      "calling time" : 32593432,
      "arguments" : [
        "video 2"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 40,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Video Codecs (Short List)\",\n      \"name\" : \"codec\",\n      \"short description\" : \"Codec Short List\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"None\",\n        \"name\" : \"None\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"None\",\n          \"nick\" : \"None\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"YUV4MPEG video encoder\",\n          \"nick\" : \"y4menc\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"On2 VP8 Encoder\",\n          \"nick\" : \"vp8enc\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Theora video encoder\",\n          \"nick\" : \"theoraenc\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Smoke video encoder\",\n          \"nick\" : \"smokeenc\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"Dirac Encoder\",\n          \"nick\" : \"schroenc\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"PNM image encoder\",\n          \"nick\" : \"pnmenc\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"PNG image encoder\",\n          \"nick\" : \"pngenc\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"JPEG image encoder\",\n          \"nick\" : \"jpegenc\",\n          \"value\" : \"8\"\n        }\n      ]\n    },\n    {\n      \"long name\" : \"More Codecs\",\n      \"name\" : \"more_codecs\",\n      \"short description\" : \"Get More codecs\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Video Pattern\",\n      \"name\" : \"pattern\",\n      \"short description\" : \"Type of test pattern to generate\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"smpte\",\n        \"name\" : \"SMPTE 100% color bars\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"SMPTE 100% color bars\",\n          \"nick\" : \"smpte\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"Random (television snow)\",\n          \"nick\" : \"snow\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"100% Black\",\n          \"nick\" : \"black\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"100% White\",\n          \"nick\" : \"white\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Red\",\n          \"nick\" : \"red\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"Green\",\n          \"nick\" : \"green\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"Blue\",\n          \"nick\" : \"blue\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"Checkers 1px\",\n          \"nick\" : \"checkers-1\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"Checkers 2px\",\n          \"nick\" : \"checkers-2\",\n          \"value\" : \"8\"\n        },\n        {\n          \"name\" : \"Checkers 4px\",\n          \"nick\" : \"checkers-4\",\n          \"value\" : \"9\"\n        },\n        {\n          \"name\" : \"Checkers 8px\",\n          \"nick\" : \"checkers-8\",\n          \"value\" : \"10\"\n        },\n        {\n          \"name\" : \"Circular\",\n          \"nick\" : \"circular\",\n          \"value\" : \"11\"\n        },\n        {\n          \"name\" : \"Blink\",\n          \"nick\" : \"blink\",\n          \"value\" : \"12\"\n        },\n        {\n          \"name\" : \"SMPTE 75% color bars\",\n          \"nick\" : \"smpte75\",\n          \"value\" : \"13\"\n        },\n        {\n          \"name\" : \"Zone plate\",\n          \"nick\" : \"zone-plate\",\n          \"value\" : \"14\"\n        },\n        {\n          \"name\" : \"Gamut checkers\",\n          \"nick\" : \"gamut\",\n          \"value\" : \"15\"\n        },\n        {\n          \"name\" : \"Chroma zone plate\",\n          \"nick\" : \"chroma-zone-plate\",\n          \"value\" : \"16\"\n        },\n        {\n          \"name\" : \"Solid color\",\n          \"nick\" : \"solid-color\",\n          \"value\" : \"17\"\n        },\n        {\n          \"name\" : \"Moving ball\",\n          \"nick\" : \"ball\",\n          \"value\" : \"18\"\n        },\n        {\n          \"name\" : \"SMPTE 100% color bars\",\n          \"nick\" : \"smpte100\",\n          \"value\" : \"19\"\n        },\n        {\n          \"name\" : \"Bar\",\n          \"nick\" : \"bar\",\n          \"value\" : \"20\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_methods_description",
      "calling time" : 32605374,
      "arguments" : [
        "video 2"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"methods\" : [\n  ]\n}"
      ]
    },
    {
      "command" : "set_property",
      "calling time" : 34724811,
      "arguments" : [
        "video 2",
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
      "calling time" : 34730742,
      "arguments" : [
        "video 2",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n    {\n      \"path\" : \"/tmp/switcher_nodeserver_video 2_video\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "remove",
      "calling time" : 34730856,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_video 2_video"
      ],
      "vector argument" : [
      ],
      "results" : [
        "false"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 34730931,
      "arguments" : [
        "fakesink",
        "vumeter_/tmp/switcher_nodeserver_video 2_video"
      ],
      "vector argument" : [
      ],
      "results" : [
        "vumeter_/tmp/switcher_nodeserver_video 2_video"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 34731451,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_video 2_video",
        "connect"
      ],
      "vector argument" : [
        "/tmp/switcher_nodeserver_video 2_video"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 34731906,
      "arguments" : [
        "prop_sub",
        "vumeter_/tmp/switcher_nodeserver_video 2_video",
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
      "calling time" : 34732677,
      "arguments" : [
        "codec"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "unsubscribe_property",
      "calling time" : 34732939,
      "arguments" : [
        "prop_sub",
        "video 2",
        "codec"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 34733052,
      "arguments" : [
        "more_codecs"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "unsubscribe_property",
      "calling time" : 34733300,
      "arguments" : [
        "prop_sub",
        "video 2",
        "more_codecs"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 34733782,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_video 2_video"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"vumeter_/tmp/switcher_nodeserver_video 2_video\",\n  \"class\" : \"fakesink\",\n  \"category\" : \"fakesink sink\",\n  \"long name\" : \"Shmdata Inspector\",\n  \"description\" : \"fakesink for testing purpose\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 35736029,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_video 2_video",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "video/x-raw-yuv, format=(fourcc)YUY2, color-matrix=(string)sdtv, chroma-site=(string)mpeg2, width=(int)320, height=(int)240, framerate=(fraction)30/1"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 35736188,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_video 2_video",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "video/x-raw-yuv, format=(fourcc)YUY2, color-matrix=(string)sdtv, chroma-site=(string)mpeg2, width=(int)320, height=(int)240, framerate=(fraction)30/1"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 35736714,
      "arguments" : [
        "video 2gtkvideosink"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 37995236,
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
      "calling time" : 38000105,
      "arguments" : [
        "dico",
        "destinations",
        "[{\"name\":\"Vancouver\",\"hostName\":\"\",\"portSoap\":\"\",\"id\":\"Vancouver\",\"data_streams\":[]}]"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 38002977,
      "arguments" : [
        "defaultrtp",
        "add_destination"
      ],
      "vector argument" : [
        "Vancouver",
        null
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 40641719,
      "arguments" : [
        "dico",
        "destinations"
      ],
      "vector argument" : [
      ],
      "results" : [
        "[{\"name\":\"Vancouver\",\"hostName\":\"\",\"portSoap\":\"\",\"id\":\"Vancouver\",\"data_streams\":[]}]"
      ]
    },
    {
      "command" : "set_property",
      "calling time" : 40642508,
      "arguments" : [
        "dico",
        "destinations",
        "[{\"name\":\"Vancouver\",\"hostName\":\"\",\"portSoap\":\"\",\"id\":\"Vancouver\",\"data_streams\":[]},{\"name\":\"Pekin\",\"hostName\":\"\",\"portSoap\":\"\",\"id\":\"Pekin\",\"data_streams\":[]}]"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 40643474,
      "arguments" : [
        "defaultrtp",
        "add_destination"
      ],
      "vector argument" : [
        "Pekin",
        null
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 51906250,
      "arguments" : [
        "dico",
        "destinations"
      ],
      "vector argument" : [
      ],
      "results" : [
        "[{\"name\":\"Vancouver\",\"hostName\":\"\",\"portSoap\":\"\",\"id\":\"Vancouver\",\"data_streams\":[]},{\"name\":\"Pekin\",\"hostName\":\"\",\"portSoap\":\"\",\"id\":\"Pekin\",\"data_streams\":[]}]"
      ]
    },
    {
      "command" : "set_property",
      "calling time" : 51906685,
      "arguments" : [
        "dico",
        "destinations",
        "[{\"name\":\"Vancouver\",\"hostName\":\"\",\"portSoap\":\"\",\"id\":\"Vancouver\",\"data_streams\":[]},{\"name\":\"Pekin\",\"hostName\":\"\",\"portSoap\":\"\",\"id\":\"Pekin\",\"data_streams\":[]},{\"name\":\"New York\",\"hostName\":\"\",\"portSoap\":\"\",\"id\":\"New York\",\"data_streams\":[]}]"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 51907300,
      "arguments" : [
        "defaultrtp",
        "add_destination"
      ],
      "vector argument" : [
        "New York",
        null
      ],
      "results" : [
        "true"
      ]
    }
  ]
}