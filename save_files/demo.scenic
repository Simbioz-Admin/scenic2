{
  "history" : [
    {
      "command" : "create_nick_named",
      "calling time" : 578844,
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
      "calling time" : 582993,
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
      "calling time" : 583960,
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
      "calling time" : 584193,
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
      "calling time" : 584494,
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
      "calling time" : 584631,
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
      "calling time" : 584757,
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
      "calling time" : 585804,
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
      "calling time" : 586093,
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
      "calling time" : 586332,
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
      "calling time" : 1879424,
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
      "calling time" : 1888258,
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
      "calling time" : 1891533,
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
      "calling time" : 1897351,
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
      "command" : "get_property_description_by_class",
      "calling time" : 7908848,
      "arguments" : [
        "v4l2src",
        "device"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"long name\" : \"Capture Device\",\n  \"name\" : \"device\",\n  \"short description\" : \"Enumeration of v4l2 capture devices\",\n  \"position category\" : \"\",\n  \"position weight\" : 120,\n  \"writable\" : \"true\",\n  \"type\" : \"enum\",\n  \"default value\" : {\n    \"value\" : \"0\",\n    \"nick\" : \"/dev/video0\",\n    \"name\" : \"UVC Camera (046d:0819)\"\n  },\n  \"values\" : [\n    {\n      \"name\" : \"UVC Camera (046d:0819)\",\n      \"nick\" : \"/dev/video0\",\n      \"value\" : \"0\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 12056326,
      "arguments" : [
        "v4l2src",
        "camera"
      ],
      "vector argument" : [
      ],
      "results" : [
        "camera"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 12068162,
      "arguments" : [
        "camera"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"camera\",\n  \"class\" : \"v4l2src\",\n  \"category\" : \"video source\",\n  \"long name\" : \"Video Capture (with v4l2)\",\n  \"description\" : \"Discover and use v4l2 supported capture cards and cameras\",\n  \"license\" : \"GPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 12068599,
      "arguments" : [
        "camera"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"camera\",\n  \"class\" : \"v4l2src\",\n  \"category\" : \"video source\",\n  \"long name\" : \"Video Capture (with v4l2)\",\n  \"description\" : \"Discover and use v4l2 supported capture cards and cameras\",\n  \"license\" : \"GPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "subscribe_signal",
      "calling time" : 12068681,
      "arguments" : [
        "signal_sub",
        "camera",
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
      "calling time" : 12068717,
      "arguments" : [
        "signal_sub",
        "camera",
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
      "calling time" : 12068746,
      "arguments" : [
        "signal_sub",
        "camera",
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
      "calling time" : 12068773,
      "arguments" : [
        "signal_sub",
        "camera",
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
      "calling time" : 12068801,
      "arguments" : [
        "signal_sub",
        "camera",
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
      "calling time" : 12068856,
      "arguments" : [
        "camera"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 40,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Video Codecs (Short List)\",\n      \"name\" : \"codec\",\n      \"short description\" : \"Codec Short List\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"None\",\n        \"name\" : \"None\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"None\",\n          \"nick\" : \"None\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"YUV4MPEG video encoder\",\n          \"nick\" : \"y4menc\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"On2 VP8 Encoder\",\n          \"nick\" : \"vp8enc\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Theora video encoder\",\n          \"nick\" : \"theoraenc\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Smoke video encoder\",\n          \"nick\" : \"smokeenc\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"Dirac Encoder\",\n          \"nick\" : \"schroenc\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"PNM image encoder\",\n          \"nick\" : \"pnmenc\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"PNG image encoder\",\n          \"nick\" : \"pngenc\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"JPEG image encoder\",\n          \"nick\" : \"jpegenc\",\n          \"value\" : \"8\"\n        }\n      ]\n    },\n    {\n      \"long name\" : \"More Codecs\",\n      \"name\" : \"more_codecs\",\n      \"short description\" : \"Get More codecs\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Capture Devices\",\n      \"name\" : \"devices-json\",\n      \"short description\" : \"Description of capture devices (json formated)\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"capture devices\\\" : [\\n    {\\n      \\\"long name\\\" : \\\"UVC Camera (046d:0819)\\\",\\n      \\\"file path\\\" : \\\"/dev/video0\\\",\\n      \\\"bus info\\\" : \\\"usb-0000:00:1d.0-1.1\\\",\\n      \\\"resolutions list\\\" : [\\n        {\\n          \\\"width\\\" : \\\"640\\\",\\n          \\\"height\\\" : \\\"480\\\"\\n        },\\n        {\\n          \\\"width\\\" : \\\"160\\\",\\n          \\\"height\\\" : \\\"120\\\"\\n        },\\n        {\\n          \\\"width\\\" : \\\"176\\\",\\n          \\\"height\\\" : \\\"144\\\"\\n        },\\n        {\\n          \\\"width\\\" : \\\"320\\\",\\n          \\\"height\\\" : \\\"176\\\"\\n        },\\n        {\\n          \\\"width\\\" : \\\"320\\\",\\n          \\\"height\\\" : \\\"240\\\"\\n        },\\n        {\\n          \\\"width\\\" : \\\"352\\\",\\n          \\\"height\\\" : \\\"288\\\"\\n        },\\n        {\\n          \\\"width\\\" : \\\"432\\\",\\n          \\\"height\\\" : \\\"240\\\"\\n        },\\n        {\\n          \\\"width\\\" : \\\"544\\\",\\n          \\\"height\\\" : \\\"288\\\"\\n        },\\n        {\\n          \\\"width\\\" : \\\"640\\\",\\n          \\\"height\\\" : \\\"360\\\"\\n        }\\n      ],\\n      \\\"stepwise max width\\\" : \\\"-1\\\",\\n      \\\"stepwise min width\\\" : \\\"-1\\\",\\n      \\\"stepwise step width\\\" : \\\"-1\\\",\\n      \\\"stepwise max height\\\" : \\\"-1\\\",\\n      \\\"stepwise min height\\\" : \\\"-1\\\",\\n      \\\"stepwise step height\\\" : \\\"-1\\\",\\n      \\\"tv standards list\\\" : [\\n        \\\"none\\\"\\n      ],\\n      \\\"frame interval list (sec.)\\\" : [\\n        {\\n          \\\"numerator\\\" : \\\"1\\\",\\n          \\\"denominator\\\" : \\\"30\\\"\\n        },\\n        {\\n          \\\"numerator\\\" : \\\"1\\\",\\n          \\\"denominator\\\" : \\\"25\\\"\\n        },\\n        {\\n          \\\"numerator\\\" : \\\"1\\\",\\n          \\\"denominator\\\" : \\\"20\\\"\\n        },\\n        {\\n          \\\"numerator\\\" : \\\"1\\\",\\n          \\\"denominator\\\" : \\\"15\\\"\\n        },\\n        {\\n          \\\"numerator\\\" : \\\"1\\\",\\n          \\\"denominator\\\" : \\\"10\\\"\\n        },\\n        {\\n          \\\"numerator\\\" : \\\"1\\\",\\n          \\\"denominator\\\" : \\\"5\\\"\\n        }\\n      ],\\n      \\\"stepwise max frame interval numerator\\\" : \\\"-1\\\",\\n      \\\"stepwise max frame interval denominator\\\" : \\\"-1\\\",\\n      \\\"stepwise min frame interval numerator\\\" : \\\"-1\\\",\\n      \\\"stepwise min frame interval denominator\\\" : \\\"-1\\\",\\n      \\\"stepwise step frame interval numerator\\\" : \\\"-1\\\",\\n      \\\"stepwise step frame interval denominator\\\" : \\\"-1\\\"\\n    }\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Capture Device\",\n      \"name\" : \"device\",\n      \"short description\" : \"Enumeration of v4l2 capture devices\",\n      \"position category\" : \"\",\n      \"position weight\" : 120,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"/dev/video0\",\n        \"name\" : \"UVC Camera (046d:0819)\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"UVC Camera (046d:0819)\",\n          \"nick\" : \"/dev/video0\",\n          \"value\" : \"0\"\n        }\n      ]\n    },\n    {\n      \"long name\" : \"Resolution\",\n      \"name\" : \"resolution\",\n      \"short description\" : \"resolution of selected capture devices\",\n      \"position category\" : \"\",\n      \"position weight\" : 140,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"640x480\",\n        \"name\" : \"640x480\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"640x480\",\n          \"nick\" : \"640x480\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"160x120\",\n          \"nick\" : \"160x120\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"176x144\",\n          \"nick\" : \"176x144\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"320x176\",\n          \"nick\" : \"320x176\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"320x240\",\n          \"nick\" : \"320x240\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"352x288\",\n          \"nick\" : \"352x288\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"432x240\",\n          \"nick\" : \"432x240\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"544x288\",\n          \"nick\" : \"544x288\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"640x360\",\n          \"nick\" : \"640x360\",\n          \"value\" : \"8\"\n        }\n      ]\n    },\n    {\n      \"long name\" : \"TV Standard\",\n      \"name\" : \"tv_standard\",\n      \"short description\" : \"tv standard of selected capture devices\",\n      \"position category\" : \"\",\n      \"position weight\" : 160,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"none\",\n        \"name\" : \"none\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"none\",\n          \"nick\" : \"none\",\n          \"value\" : \"0\"\n        }\n      ]\n    },\n    {\n      \"long name\" : \"Framerate\",\n      \"name\" : \"framerate\",\n      \"short description\" : \"framerate of selected capture devices\",\n      \"position category\" : \"\",\n      \"position weight\" : 180,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"30/1\",\n        \"name\" : \"30/1\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"30/1\",\n          \"nick\" : \"30/1\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"25/1\",\n          \"nick\" : \"25/1\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"20/1\",\n          \"nick\" : \"20/1\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"15/1\",\n          \"nick\" : \"15/1\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"10/1\",\n          \"nick\" : \"10/1\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"5/1\",\n          \"nick\" : \"5/1\",\n          \"value\" : \"5\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 12069973,
      "arguments" : [
        "prop_sub",
        "camera",
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
      "calling time" : 12070046,
      "arguments" : [
        "prop_sub",
        "camera",
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
      "calling time" : 12070102,
      "arguments" : [
        "prop_sub",
        "camera",
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
      "calling time" : 12070146,
      "arguments" : [
        "prop_sub",
        "camera",
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
      "calling time" : 12070191,
      "arguments" : [
        "prop_sub",
        "camera",
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
      "calling time" : 12070232,
      "arguments" : [
        "prop_sub",
        "camera",
        "devices-json"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 12070275,
      "arguments" : [
        "prop_sub",
        "camera",
        "device"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 12070316,
      "arguments" : [
        "prop_sub",
        "camera",
        "resolution"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 12070356,
      "arguments" : [
        "prop_sub",
        "camera",
        "tv_standard"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 12070402,
      "arguments" : [
        "prop_sub",
        "camera",
        "framerate"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 12070870,
      "arguments" : [
        "camera",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n  ]\n}"
      ]
    },
    {
      "command" : "set_property",
      "calling time" : 12071308,
      "arguments" : [
        "camera",
        "device",
        "0"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 12071545,
      "arguments" : [
        "resolution"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "unsubscribe_property",
      "calling time" : 12071627,
      "arguments" : [
        "prop_sub",
        "camera",
        "resolution"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 12071689,
      "arguments" : [
        "resolution"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 12071749,
      "arguments" : [
        "prop_sub",
        "camera",
        "resolution"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 12071799,
      "arguments" : [
        "tv_standard"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "unsubscribe_property",
      "calling time" : 12071865,
      "arguments" : [
        "prop_sub",
        "camera",
        "tv_standard"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 12072025,
      "arguments" : [
        "tv_standard"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 12072172,
      "arguments" : [
        "prop_sub",
        "camera",
        "tv_standard"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 12072309,
      "arguments" : [
        "framerate"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "unsubscribe_property",
      "calling time" : 12072452,
      "arguments" : [
        "prop_sub",
        "camera",
        "framerate"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 12072586,
      "arguments" : [
        "framerate"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 12073256,
      "arguments" : [
        "prop_sub",
        "camera",
        "framerate"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_properties_description",
      "calling time" : 12081198,
      "arguments" : [
        "camera"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 40,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Video Codecs (Short List)\",\n      \"name\" : \"codec\",\n      \"short description\" : \"Codec Short List\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"None\",\n        \"name\" : \"None\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"None\",\n          \"nick\" : \"None\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"YUV4MPEG video encoder\",\n          \"nick\" : \"y4menc\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"On2 VP8 Encoder\",\n          \"nick\" : \"vp8enc\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Theora video encoder\",\n          \"nick\" : \"theoraenc\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Smoke video encoder\",\n          \"nick\" : \"smokeenc\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"Dirac Encoder\",\n          \"nick\" : \"schroenc\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"PNM image encoder\",\n          \"nick\" : \"pnmenc\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"PNG image encoder\",\n          \"nick\" : \"pngenc\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"JPEG image encoder\",\n          \"nick\" : \"jpegenc\",\n          \"value\" : \"8\"\n        }\n      ]\n    },\n    {\n      \"long name\" : \"More Codecs\",\n      \"name\" : \"more_codecs\",\n      \"short description\" : \"Get More codecs\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Capture Devices\",\n      \"name\" : \"devices-json\",\n      \"short description\" : \"Description of capture devices (json formated)\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"capture devices\\\" : [\\n    {\\n      \\\"long name\\\" : \\\"UVC Camera (046d:0819)\\\",\\n      \\\"file path\\\" : \\\"/dev/video0\\\",\\n      \\\"bus info\\\" : \\\"usb-0000:00:1d.0-1.1\\\",\\n      \\\"resolutions list\\\" : [\\n        {\\n          \\\"width\\\" : \\\"640\\\",\\n          \\\"height\\\" : \\\"480\\\"\\n        },\\n        {\\n          \\\"width\\\" : \\\"160\\\",\\n          \\\"height\\\" : \\\"120\\\"\\n        },\\n        {\\n          \\\"width\\\" : \\\"176\\\",\\n          \\\"height\\\" : \\\"144\\\"\\n        },\\n        {\\n          \\\"width\\\" : \\\"320\\\",\\n          \\\"height\\\" : \\\"176\\\"\\n        },\\n        {\\n          \\\"width\\\" : \\\"320\\\",\\n          \\\"height\\\" : \\\"240\\\"\\n        },\\n        {\\n          \\\"width\\\" : \\\"352\\\",\\n          \\\"height\\\" : \\\"288\\\"\\n        },\\n        {\\n          \\\"width\\\" : \\\"432\\\",\\n          \\\"height\\\" : \\\"240\\\"\\n        },\\n        {\\n          \\\"width\\\" : \\\"544\\\",\\n          \\\"height\\\" : \\\"288\\\"\\n        },\\n        {\\n          \\\"width\\\" : \\\"640\\\",\\n          \\\"height\\\" : \\\"360\\\"\\n        }\\n      ],\\n      \\\"stepwise max width\\\" : \\\"-1\\\",\\n      \\\"stepwise min width\\\" : \\\"-1\\\",\\n      \\\"stepwise step width\\\" : \\\"-1\\\",\\n      \\\"stepwise max height\\\" : \\\"-1\\\",\\n      \\\"stepwise min height\\\" : \\\"-1\\\",\\n      \\\"stepwise step height\\\" : \\\"-1\\\",\\n      \\\"tv standards list\\\" : [\\n        \\\"none\\\"\\n      ],\\n      \\\"frame interval list (sec.)\\\" : [\\n        {\\n          \\\"numerator\\\" : \\\"1\\\",\\n          \\\"denominator\\\" : \\\"30\\\"\\n        },\\n        {\\n          \\\"numerator\\\" : \\\"1\\\",\\n          \\\"denominator\\\" : \\\"25\\\"\\n        },\\n        {\\n          \\\"numerator\\\" : \\\"1\\\",\\n          \\\"denominator\\\" : \\\"20\\\"\\n        },\\n        {\\n          \\\"numerator\\\" : \\\"1\\\",\\n          \\\"denominator\\\" : \\\"15\\\"\\n        },\\n        {\\n          \\\"numerator\\\" : \\\"1\\\",\\n          \\\"denominator\\\" : \\\"10\\\"\\n        },\\n        {\\n          \\\"numerator\\\" : \\\"1\\\",\\n          \\\"denominator\\\" : \\\"5\\\"\\n        }\\n      ],\\n      \\\"stepwise max frame interval numerator\\\" : \\\"-1\\\",\\n      \\\"stepwise max frame interval denominator\\\" : \\\"-1\\\",\\n      \\\"stepwise min frame interval numerator\\\" : \\\"-1\\\",\\n      \\\"stepwise min frame interval denominator\\\" : \\\"-1\\\",\\n      \\\"stepwise step frame interval numerator\\\" : \\\"-1\\\",\\n      \\\"stepwise step frame interval denominator\\\" : \\\"-1\\\"\\n    }\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Capture Device\",\n      \"name\" : \"device\",\n      \"short description\" : \"Enumeration of v4l2 capture devices\",\n      \"position category\" : \"\",\n      \"position weight\" : 120,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"/dev/video0\",\n        \"name\" : \"UVC Camera (046d:0819)\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"UVC Camera (046d:0819)\",\n          \"nick\" : \"/dev/video0\",\n          \"value\" : \"0\"\n        }\n      ]\n    },\n    {\n      \"long name\" : \"Resolution\",\n      \"name\" : \"resolution\",\n      \"short description\" : \"resolution of selected capture devices\",\n      \"position category\" : \"\",\n      \"position weight\" : 200,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"640x480\",\n        \"name\" : \"640x480\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"640x480\",\n          \"nick\" : \"640x480\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"160x120\",\n          \"nick\" : \"160x120\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"176x144\",\n          \"nick\" : \"176x144\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"320x176\",\n          \"nick\" : \"320x176\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"320x240\",\n          \"nick\" : \"320x240\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"352x288\",\n          \"nick\" : \"352x288\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"432x240\",\n          \"nick\" : \"432x240\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"544x288\",\n          \"nick\" : \"544x288\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"640x360\",\n          \"nick\" : \"640x360\",\n          \"value\" : \"8\"\n        }\n      ]\n    },\n    {\n      \"long name\" : \"TV Standard\",\n      \"name\" : \"tv_standard\",\n      \"short description\" : \"tv standard of selected capture devices\",\n      \"position category\" : \"\",\n      \"position weight\" : 220,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"none\",\n        \"name\" : \"none\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"none\",\n          \"nick\" : \"none\",\n          \"value\" : \"0\"\n        }\n      ]\n    },\n    {\n      \"long name\" : \"Framerate\",\n      \"name\" : \"framerate\",\n      \"short description\" : \"framerate of selected capture devices\",\n      \"position category\" : \"\",\n      \"position weight\" : 240,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"30/1\",\n        \"name\" : \"30/1\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"30/1\",\n          \"nick\" : \"30/1\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"25/1\",\n          \"nick\" : \"25/1\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"20/1\",\n          \"nick\" : \"20/1\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"15/1\",\n          \"nick\" : \"15/1\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"10/1\",\n          \"nick\" : \"10/1\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"5/1\",\n          \"nick\" : \"5/1\",\n          \"value\" : \"5\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_methods_description",
      "calling time" : 12083403,
      "arguments" : [
        "camera"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"methods\" : [\n  ]\n}"
      ]
    },
    {
      "command" : "set_property",
      "calling time" : 26794796,
      "arguments" : [
        "camera",
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
      "calling time" : 27487135,
      "arguments" : [
        "camera",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n    {\n      \"path\" : \"/tmp/switcher_nodeserver_camera_video\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "remove",
      "calling time" : 27487314,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_camera_video"
      ],
      "vector argument" : [
      ],
      "results" : [
        "false"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 27487390,
      "arguments" : [
        "fakesink",
        "vumeter_/tmp/switcher_nodeserver_camera_video"
      ],
      "vector argument" : [
      ],
      "results" : [
        "vumeter_/tmp/switcher_nodeserver_camera_video"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 27487941,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_camera_video",
        "connect"
      ],
      "vector argument" : [
        "/tmp/switcher_nodeserver_camera_video"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 27488639,
      "arguments" : [
        "prop_sub",
        "vumeter_/tmp/switcher_nodeserver_camera_video",
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
      "calling time" : 27489109,
      "arguments" : [
        "resolution"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "unsubscribe_property",
      "calling time" : 27489315,
      "arguments" : [
        "prop_sub",
        "camera",
        "resolution"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 27489370,
      "arguments" : [
        "tv_standard"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "unsubscribe_property",
      "calling time" : 27489504,
      "arguments" : [
        "prop_sub",
        "camera",
        "tv_standard"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 27489553,
      "arguments" : [
        "device"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "unsubscribe_property",
      "calling time" : 27489662,
      "arguments" : [
        "prop_sub",
        "camera",
        "device"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 27489711,
      "arguments" : [
        "framerate"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "unsubscribe_property",
      "calling time" : 27489831,
      "arguments" : [
        "prop_sub",
        "camera",
        "framerate"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 27489885,
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
      "calling time" : 27489996,
      "arguments" : [
        "prop_sub",
        "camera",
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
      "calling time" : 27490041,
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
      "calling time" : 27490150,
      "arguments" : [
        "prop_sub",
        "camera",
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
      "calling time" : 27490474,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_camera_video"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"vumeter_/tmp/switcher_nodeserver_camera_video\",\n  \"class\" : \"fakesink\",\n  \"category\" : \"fakesink sink\",\n  \"long name\" : \"Shmdata Inspector\",\n  \"description\" : \"fakesink for testing purpose\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 28492375,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_camera_video",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "video/x-raw-yuv, format=(fourcc)YUY2, width=(int)640, height=(int)480, interlaced=(boolean)false, pixel-aspect-ratio=(fraction)1/1, framerate=(fraction)30/1"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 28492897,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_camera_video",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "video/x-raw-yuv, format=(fourcc)YUY2, width=(int)640, height=(int)480, interlaced=(boolean)false, pixel-aspect-ratio=(fraction)1/1, framerate=(fraction)30/1"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 28494646,
      "arguments" : [
        "cameragtkvideosink"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 29744084,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_camera_video",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "video/x-raw-yuv, format=(fourcc)YUY2, width=(int)640, height=(int)480, interlaced=(boolean)false, pixel-aspect-ratio=(fraction)1/1, framerate=(fraction)30/1"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 29744488,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_camera_video",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "video/x-raw-yuv, format=(fourcc)YUY2, width=(int)640, height=(int)480, interlaced=(boolean)false, pixel-aspect-ratio=(fraction)1/1, framerate=(fraction)30/1"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 29749935,
      "arguments" : [
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 29751157,
      "arguments" : [
        "gtkvideosink",
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video"
      ],
      "vector argument" : [
      ],
      "results" : [
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 29829970,
      "arguments" : [
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"gtkvideosink_/tmp/switcher_nodeserver_camera_video\",\n  \"class\" : \"gtkvideosink\",\n  \"category\" : \"video sink\",\n  \"long name\" : \"Video Display\",\n  \"description\" : \"Video window with fullscreen\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 29831212,
      "arguments" : [
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"gtkvideosink_/tmp/switcher_nodeserver_camera_video\",\n  \"class\" : \"gtkvideosink\",\n  \"category\" : \"video sink\",\n  \"long name\" : \"Video Display\",\n  \"description\" : \"Video window with fullscreen\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "subscribe_signal",
      "calling time" : 29831496,
      "arguments" : [
        "signal_sub",
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video",
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
      "calling time" : 29831637,
      "arguments" : [
        "signal_sub",
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video",
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
      "calling time" : 29831757,
      "arguments" : [
        "signal_sub",
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video",
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
      "calling time" : 29831902,
      "arguments" : [
        "signal_sub",
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video",
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
      "calling time" : 29832036,
      "arguments" : [
        "signal_sub",
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video",
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
      "calling time" : 29832376,
      "arguments" : [
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Fullscreen\",\n      \"name\" : \"fullscreen\",\n      \"short description\" : \"Enable/Disable Fullscreen\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Flip Method\",\n      \"name\" : \"method\",\n      \"short description\" : \"method\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"none\",\n        \"name\" : \"Identity (no rotation)\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"Identity (no rotation)\",\n          \"nick\" : \"none\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"Rotate clockwise 90 degrees\",\n          \"nick\" : \"clockwise\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"Rotate 180 degrees\",\n          \"nick\" : \"rotate-180\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Rotate counter-clockwise 90 degrees\",\n          \"nick\" : \"counterclockwise\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Flip horizontally\",\n          \"nick\" : \"horizontal-flip\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"Flip vertically\",\n          \"nick\" : \"vertical-flip\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"Flip across upper left/lower right diagonal\",\n          \"nick\" : \"upper-left-diagonal\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"Flip across upper right/lower left diagonal\",\n          \"nick\" : \"upper-right-diagonal\",\n          \"value\" : \"7\"\n        }\n      ]\n    },\n    {\n      \"long name\" : \"Gamma\",\n      \"name\" : \"gamma\",\n      \"short description\" : \"gamma\",\n      \"position category\" : \"\",\n      \"position weight\" : 120,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0.01\",\n      \"maximum\" : \"10\",\n      \"default value\" : \"1\"\n    },\n    {\n      \"long name\" : \"Contrast\",\n      \"name\" : \"contrast\",\n      \"short description\" : \"contrast\",\n      \"position category\" : \"\",\n      \"position weight\" : 140,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"2\",\n      \"default value\" : \"1\"\n    },\n    {\n      \"long name\" : \"Brightness\",\n      \"name\" : \"brightness\",\n      \"short description\" : \"brightness\",\n      \"position category\" : \"\",\n      \"position weight\" : 160,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"-1\",\n      \"maximum\" : \"1\",\n      \"default value\" : \"0\"\n    },\n    {\n      \"long name\" : \"Hue\",\n      \"name\" : \"hue\",\n      \"short description\" : \"hue\",\n      \"position category\" : \"\",\n      \"position weight\" : 180,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"-1\",\n      \"maximum\" : \"1\",\n      \"default value\" : \"0\"\n    },\n    {\n      \"long name\" : \"Saturation\",\n      \"name\" : \"saturation\",\n      \"short description\" : \"saturation\",\n      \"position category\" : \"\",\n      \"position weight\" : 200,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"2\",\n      \"default value\" : \"1\"\n    },\n    {\n      \"long name\" : \"Window Title\",\n      \"name\" : \"title\",\n      \"short description\" : \"Window Title\",\n      \"position category\" : \"\",\n      \"position weight\" : 220,\n      \"writable\" : \"true\",\n      \"type\" : \"string\",\n      \"default value\" : \"gtkvideosink_/tmp/switcher_nodeserver_camera_video\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 29833780,
      "arguments" : [
        "prop_sub",
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video",
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
      "calling time" : 29833969,
      "arguments" : [
        "prop_sub",
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video",
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
      "calling time" : 29834116,
      "arguments" : [
        "prop_sub",
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video",
        "fullscreen"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 29834244,
      "arguments" : [
        "prop_sub",
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video",
        "method"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 29834388,
      "arguments" : [
        "prop_sub",
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video",
        "gamma"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 29834512,
      "arguments" : [
        "prop_sub",
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video",
        "contrast"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 29834642,
      "arguments" : [
        "prop_sub",
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video",
        "brightness"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 29834783,
      "arguments" : [
        "prop_sub",
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video",
        "hue"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 29834918,
      "arguments" : [
        "prop_sub",
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video",
        "saturation"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 29835073,
      "arguments" : [
        "prop_sub",
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video",
        "title"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 29838162,
      "arguments" : [
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video",
        "connect"
      ],
      "vector argument" : [
        "/tmp/switcher_nodeserver_camera_video"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 29861513,
      "arguments" : [
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n  ]\n}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 37398834,
      "arguments" : [
        "gtkvideosink_/tmp/switcher_nodeserver_camera_video"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "get_property_description_by_class",
      "calling time" : 40695657,
      "arguments" : [
        "pulsesrc",
        "device"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"long name\" : \"Capture Device\",\n  \"name\" : \"device\",\n  \"short description\" : \"Enumeration of Pulse capture devices\",\n  \"position category\" : \"\",\n  \"position weight\" : 120,\n  \"writable\" : \"true\",\n  \"type\" : \"enum\",\n  \"default value\" : {\n    \"value\" : \"0\",\n    \"nick\" : \"alsa_output.pci-0000_05_00.1.hdmi-stereo-extra2.monitor\",\n    \"name\" : \"Monitor of GF110 High Definition Audio Controller Digital Stereo (HDMI)\"\n  },\n  \"values\" : [\n    {\n      \"name\" : \"Monitor of GF110 High Definition Audio Controller Digital Stereo (HDMI)\",\n      \"nick\" : \"alsa_output.pci-0000_05_00.1.hdmi-stereo-extra2.monitor\",\n      \"value\" : \"0\"\n    },\n    {\n      \"name\" : \"Monitor of Built-in Audio Analog Stereo\",\n      \"nick\" : \"alsa_output.pci-0000_00_1b.0.analog-stereo.monitor\",\n      \"value\" : \"1\"\n    },\n    {\n      \"name\" : \"Built-in Audio Analog Stereo\",\n      \"nick\" : \"alsa_input.pci-0000_00_1b.0.analog-stereo\",\n      \"value\" : \"2\"\n    },\n    {\n      \"name\" : \"Webcam C210 Analog Mono\",\n      \"nick\" : \"alsa_input.usb-046d_0819_635C87E0-02-U0x46d0x819.analog-mono\",\n      \"value\" : \"3\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 50191806,
      "arguments" : [
        "pulsesrc",
        "micro"
      ],
      "vector argument" : [
      ],
      "results" : [
        "micro"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 50198026,
      "arguments" : [
        "micro"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"micro\",\n  \"class\" : \"pulsesrc\",\n  \"category\" : \"audio source\",\n  \"long name\" : \"Audio Device Source (Pulse)\",\n  \"description\" : \"Inspecting Devices And Getting Audio From Inputs\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 50199096,
      "arguments" : [
        "micro"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"micro\",\n  \"class\" : \"pulsesrc\",\n  \"category\" : \"audio source\",\n  \"long name\" : \"Audio Device Source (Pulse)\",\n  \"description\" : \"Inspecting Devices And Getting Audio From Inputs\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "subscribe_signal",
      "calling time" : 50199320,
      "arguments" : [
        "signal_sub",
        "micro",
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
      "calling time" : 50199397,
      "arguments" : [
        "signal_sub",
        "micro",
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
      "calling time" : 50199522,
      "arguments" : [
        "signal_sub",
        "micro",
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
      "calling time" : 50199605,
      "arguments" : [
        "signal_sub",
        "micro",
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
      "calling time" : 50199673,
      "arguments" : [
        "signal_sub",
        "micro",
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
      "calling time" : 50199854,
      "arguments" : [
        "micro"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Volume\",\n      \"name\" : \"volume\",\n      \"short description\" : \"Linear volume of this stream, 1.0=100%\",\n      \"position category\" : \"\",\n      \"position weight\" : 40,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"10\",\n      \"default value\" : \"1\"\n    },\n    {\n      \"long name\" : \"Mute\",\n      \"name\" : \"mute\",\n      \"short description\" : \"Mute state of this stream\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Capture Devices\",\n      \"name\" : \"devices-json\",\n      \"short description\" : \"Description of capture devices (json formated)\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"capture devices\\\" : [\\n    {\\n      \\\"long name\\\" : \\\"Monitor of GF110 High Definition Audio Controller Digital Stereo (HDMI)\\\",\\n      \\\"name\\\" : \\\"alsa_output.pci-0000_05_00.1.hdmi-stereo-extra2.monitor\\\",\\n      \\\"state\\\" : \\\"SUSPENDED\\\",\\n      \\\"sample format\\\" : \\\"s16le\\\",\\n      \\\"sample rate\\\" : \\\"44100\\\",\\n      \\\"channels\\\" : \\\"2\\\",\\n      \\\"active port\\\" : \\\"n/a\\\"\\n    },\\n    {\\n      \\\"long name\\\" : \\\"Monitor of Built-in Audio Analog Stereo\\\",\\n      \\\"name\\\" : \\\"alsa_output.pci-0000_00_1b.0.analog-stereo.monitor\\\",\\n      \\\"state\\\" : \\\"SUSPENDED\\\",\\n      \\\"sample format\\\" : \\\"s16le\\\",\\n      \\\"sample rate\\\" : \\\"44100\\\",\\n      \\\"channels\\\" : \\\"2\\\",\\n      \\\"active port\\\" : \\\"n/a\\\"\\n    },\\n    {\\n      \\\"long name\\\" : \\\"Built-in Audio Analog Stereo\\\",\\n      \\\"name\\\" : \\\"alsa_input.pci-0000_00_1b.0.analog-stereo\\\",\\n      \\\"state\\\" : \\\"SUSPENDED\\\",\\n      \\\"sample format\\\" : \\\"s16le\\\",\\n      \\\"sample rate\\\" : \\\"48000\\\",\\n      \\\"channels\\\" : \\\"2\\\",\\n      \\\"active port\\\" : \\\"Line In\\\"\\n    },\\n    {\\n      \\\"long name\\\" : \\\"Webcam C210 Analog Mono\\\",\\n      \\\"name\\\" : \\\"alsa_input.usb-046d_0819_635C87E0-02-U0x46d0x819.analog-mono\\\",\\n      \\\"state\\\" : \\\"SUSPENDED\\\",\\n      \\\"sample format\\\" : \\\"s16le\\\",\\n      \\\"sample rate\\\" : \\\"48000\\\",\\n      \\\"channels\\\" : \\\"1\\\",\\n      \\\"active port\\\" : \\\"Microphone\\\"\\n    }\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Capture Device\",\n      \"name\" : \"device\",\n      \"short description\" : \"Enumeration of Pulse capture devices\",\n      \"position category\" : \"\",\n      \"position weight\" : 120,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"alsa_output.pci-0000_05_00.1.hdmi-stereo-extra2.monitor\",\n        \"name\" : \"Monitor of GF110 High Definition Audio Controller Digital Stereo (HDMI)\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"Monitor of GF110 High Definition Audio Controller Digital Stereo (HDMI)\",\n          \"nick\" : \"alsa_output.pci-0000_05_00.1.hdmi-stereo-extra2.monitor\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"Monitor of Built-in Audio Analog Stereo\",\n          \"nick\" : \"alsa_output.pci-0000_00_1b.0.analog-stereo.monitor\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"Built-in Audio Analog Stereo\",\n          \"nick\" : \"alsa_input.pci-0000_00_1b.0.analog-stereo\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Webcam C210 Analog Mono\",\n          \"nick\" : \"alsa_input.usb-046d_0819_635C87E0-02-U0x46d0x819.analog-mono\",\n          \"value\" : \"3\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 50200980,
      "arguments" : [
        "prop_sub",
        "micro",
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
      "calling time" : 50201154,
      "arguments" : [
        "prop_sub",
        "micro",
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
      "calling time" : 50201276,
      "arguments" : [
        "prop_sub",
        "micro",
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
      "calling time" : 50201433,
      "arguments" : [
        "prop_sub",
        "micro",
        "mute"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 50201613,
      "arguments" : [
        "prop_sub",
        "micro",
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
      "calling time" : 50201759,
      "arguments" : [
        "prop_sub",
        "micro",
        "devices-json"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 50201861,
      "arguments" : [
        "prop_sub",
        "micro",
        "device"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 50202305,
      "arguments" : [
        "micro",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n  ]\n}"
      ]
    },
    {
      "command" : "set_property",
      "calling time" : 50206139,
      "arguments" : [
        "micro",
        "device",
        "3"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_properties_description",
      "calling time" : 50219218,
      "arguments" : [
        "micro"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Volume\",\n      \"name\" : \"volume\",\n      \"short description\" : \"Linear volume of this stream, 1.0=100%\",\n      \"position category\" : \"\",\n      \"position weight\" : 40,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"10\",\n      \"default value\" : \"1\"\n    },\n    {\n      \"long name\" : \"Mute\",\n      \"name\" : \"mute\",\n      \"short description\" : \"Mute state of this stream\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Capture Devices\",\n      \"name\" : \"devices-json\",\n      \"short description\" : \"Description of capture devices (json formated)\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"capture devices\\\" : [\\n    {\\n      \\\"long name\\\" : \\\"Monitor of GF110 High Definition Audio Controller Digital Stereo (HDMI)\\\",\\n      \\\"name\\\" : \\\"alsa_output.pci-0000_05_00.1.hdmi-stereo-extra2.monitor\\\",\\n      \\\"state\\\" : \\\"SUSPENDED\\\",\\n      \\\"sample format\\\" : \\\"s16le\\\",\\n      \\\"sample rate\\\" : \\\"44100\\\",\\n      \\\"channels\\\" : \\\"2\\\",\\n      \\\"active port\\\" : \\\"n/a\\\"\\n    },\\n    {\\n      \\\"long name\\\" : \\\"Monitor of Built-in Audio Analog Stereo\\\",\\n      \\\"name\\\" : \\\"alsa_output.pci-0000_00_1b.0.analog-stereo.monitor\\\",\\n      \\\"state\\\" : \\\"SUSPENDED\\\",\\n      \\\"sample format\\\" : \\\"s16le\\\",\\n      \\\"sample rate\\\" : \\\"44100\\\",\\n      \\\"channels\\\" : \\\"2\\\",\\n      \\\"active port\\\" : \\\"n/a\\\"\\n    },\\n    {\\n      \\\"long name\\\" : \\\"Built-in Audio Analog Stereo\\\",\\n      \\\"name\\\" : \\\"alsa_input.pci-0000_00_1b.0.analog-stereo\\\",\\n      \\\"state\\\" : \\\"SUSPENDED\\\",\\n      \\\"sample format\\\" : \\\"s16le\\\",\\n      \\\"sample rate\\\" : \\\"48000\\\",\\n      \\\"channels\\\" : \\\"2\\\",\\n      \\\"active port\\\" : \\\"Line In\\\"\\n    },\\n    {\\n      \\\"long name\\\" : \\\"Webcam C210 Analog Mono\\\",\\n      \\\"name\\\" : \\\"alsa_input.usb-046d_0819_635C87E0-02-U0x46d0x819.analog-mono\\\",\\n      \\\"state\\\" : \\\"SUSPENDED\\\",\\n      \\\"sample format\\\" : \\\"s16le\\\",\\n      \\\"sample rate\\\" : \\\"48000\\\",\\n      \\\"channels\\\" : \\\"1\\\",\\n      \\\"active port\\\" : \\\"Microphone\\\"\\n    }\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Capture Device\",\n      \"name\" : \"device\",\n      \"short description\" : \"Enumeration of Pulse capture devices\",\n      \"position category\" : \"\",\n      \"position weight\" : 120,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"3\",\n        \"nick\" : \"alsa_input.usb-046d_0819_635C87E0-02-U0x46d0x819.analog-mono\",\n        \"name\" : \"Webcam C210 Analog Mono\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"Monitor of GF110 High Definition Audio Controller Digital Stereo (HDMI)\",\n          \"nick\" : \"alsa_output.pci-0000_05_00.1.hdmi-stereo-extra2.monitor\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"Monitor of Built-in Audio Analog Stereo\",\n          \"nick\" : \"alsa_output.pci-0000_00_1b.0.analog-stereo.monitor\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"Built-in Audio Analog Stereo\",\n          \"nick\" : \"alsa_input.pci-0000_00_1b.0.analog-stereo\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Webcam C210 Analog Mono\",\n          \"nick\" : \"alsa_input.usb-046d_0819_635C87E0-02-U0x46d0x819.analog-mono\",\n          \"value\" : \"3\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_methods_description",
      "calling time" : 50222267,
      "arguments" : [
        "micro"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"methods\" : [\n  ]\n}"
      ]
    },
    {
      "command" : "set_property",
      "calling time" : 51493743,
      "arguments" : [
        "micro",
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
      "calling time" : 51534396,
      "arguments" : [
        "micro",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n    {\n      \"path\" : \"/tmp/switcher_nodeserver_micro_audio\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "remove",
      "calling time" : 51534717,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_micro_audio"
      ],
      "vector argument" : [
      ],
      "results" : [
        "false"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 51534894,
      "arguments" : [
        "fakesink",
        "vumeter_/tmp/switcher_nodeserver_micro_audio"
      ],
      "vector argument" : [
      ],
      "results" : [
        "vumeter_/tmp/switcher_nodeserver_micro_audio"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 51536564,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_micro_audio",
        "connect"
      ],
      "vector argument" : [
        "/tmp/switcher_nodeserver_micro_audio"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 51538178,
      "arguments" : [
        "prop_sub",
        "vumeter_/tmp/switcher_nodeserver_micro_audio",
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
      "calling time" : 51539398,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_micro_audio"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"vumeter_/tmp/switcher_nodeserver_micro_audio\",\n  \"class\" : \"fakesink\",\n  \"category\" : \"fakesink sink\",\n  \"long name\" : \"Shmdata Inspector\",\n  \"description\" : \"fakesink for testing purpose\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 52543328,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_micro_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "audio/x-raw-int, endianness=(int)1234, signed=(boolean)true, width=(int)16, depth=(int)16, rate=(int)44100, channels=(int)2"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 52543638,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_micro_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "audio/x-raw-int, endianness=(int)1234, signed=(boolean)true, width=(int)16, depth=(int)16, rate=(int)44100, channels=(int)2"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 52544597,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_micro_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "audio/x-raw-int, endianness=(int)1234, signed=(boolean)true, width=(int)16, depth=(int)16, rate=(int)44100, channels=(int)2"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 52544848,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_micro_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "audio/x-raw-int, endianness=(int)1234, signed=(boolean)true, width=(int)16, depth=(int)16, rate=(int)44100, channels=(int)2"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 52545371,
      "arguments" : [
        "micropulsesink"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 52545906,
      "arguments" : [
        "micropulsesink"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    }
  ]
}