{
  "history" : [
    {
      "command" : "create_nick_named",
      "calling time" : 487407,
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
      "calling time" : 491872,
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
      "command" : "has_method",
      "calling time" : 493927,
      "arguments" : [
        "defaultrtp",
        "set_runtime"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 493941,
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
      "calling time" : 495791,
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
      "calling time" : 497695,
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
      "calling time" : 499127,
      "arguments" : [
        "defaultrtp",
        "set_runtime"
      ],
      "vector argument" : [
        "single_runtime"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "has_method",
      "calling time" : 500603,
      "arguments" : [
        "dico",
        "set_runtime"
      ],
      "vector argument" : [
      ],
      "results" : [
        "false"
      ]
    },
    {
      "command" : "has_method",
      "calling time" : 500643,
      "arguments" : [
        "soap",
        "set_runtime"
      ],
      "vector argument" : [
      ],
      "results" : [
        "false"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 518090,
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
      "calling time" : 519688,
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
      "calling time" : 521012,
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
      "calling time" : 2163151,
      "arguments" : [
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"classes\" : [\n    {\n      \"long name\" : \"Switcher OSC Controler\",\n      \"category\" : \"control server\",\n      \"short description\" : \"OSCcontrolServer allows for managing switcher through OSC\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"OSCctl\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"OSC message to property\",\n      \"category\" : \"network converter\",\n      \"short description\" : \"OSCprop reveives OSC messages and updates associated property\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"OSCprop\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Switcher Web Client (SOAP)\",\n      \"category\" : \"control client\",\n      \"short description\" : \"controling a switcher instance through SOAP webservices\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"SOAPcontrolClient\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Switcher Web Controler (SOAP)\",\n      \"category\" : \"control server\",\n      \"short description\" : \"getting switcher controled through SOAP webservices\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"SOAPcontrolServer\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"AAC encoder\",\n      \"category\" : \"audio encoder\",\n      \"short description\" : \"AAC encoder (2 channels max)\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"aacenc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Audio Test\",\n      \"category\" : \"audio source\",\n      \"short description\" : \"Creates audio test signals\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"audiotestsrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Quiddity Creation Inspector\",\n      \"category\" : \"spy\",\n      \"short description\" : \"spy manager for quidity creation and removal and convert into signals\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"create_remove_spy\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata Decoder\",\n      \"category\" : \"decodebin2\",\n      \"short description\" : \"connect to a shmdata, decode it and write decoded frames to shmdata(s)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"decoder\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Deinterleave\",\n      \"category\" : \"video converter\",\n      \"short description\" : \"connect to an audio shmdata and split channels to multiple shmdata(s)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"deinterleave\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Dictionary\",\n      \"category\" : \"dictionary\",\n      \"short description\" : \"Dictionary of string key/values accessible through properties\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"dico\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata From Software\",\n      \"category\" : \"fake source\",\n      \"short description\" : \"add a shmdata from an other software\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"fakeshmsrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata Inspector\",\n      \"category\" : \"fakesink sink\",\n      \"short description\" : \"fakesink for testing purpose\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"fakesink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"File SDP Receiver\",\n      \"category\" : \"network\",\n      \"short description\" : \"get raw stream from sdp file\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"filesdp\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"GenICam Camera\",\n      \"category\" : \"genicam video\",\n      \"short description\" : \"Genicam video source using the Aravis library\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"genicam\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"GStreamer Pipeline\",\n      \"category\" : \"source\",\n      \"short description\" : \"GStreamer (src) pipeline description to a *single* shmdata\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"gstsrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"GStreamer Video Pipeline\",\n      \"category\" : \"video source\",\n      \"short description\" : \"GStreamer (src) video pipeline description to a *single* shmdata\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"gstvideosrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Display\",\n      \"category\" : \"video sink\",\n      \"short description\" : \"Video window with fullscreen\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"gtkvideosink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"HTTP/SDP Receiver\",\n      \"category\" : \"network\",\n      \"short description\" : \"get raw stream from sdp file distributed with http\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"httpsdp\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"HTTP/SDP Decoder\",\n      \"category\" : \"network source\",\n      \"short description\" : \"decode an sdp-described stream deliver through http and make shmdatas\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"httpsdpdec\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Jack Audio\",\n      \"category\" : \"test\",\n      \"short description\" : \"get audio from jack\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"jackaudiosrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Audio Display (with Jack Audio)\",\n      \"category\" : \"audio sink\",\n      \"short description\" : \"Audio display with minimal features\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"jacksink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"JPEG Encoder\",\n      \"category\" : \"video encoder\",\n      \"short description\" : \"JPEG encoder\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"jpegenc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Switcher Logger\",\n      \"category\" : \"log\",\n      \"short description\" : \"manage switcher logs and other glib log domains.\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"logger\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Midi (PortMidiSink)\",\n      \"category\" : \"midi sink\",\n      \"short description\" : \"shmdata to midi\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"midisink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Midi (PortMidi)\",\n      \"category\" : \"midi source\",\n      \"short description\" : \"midi to shmdata and properties\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"midisrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"My Plugin\",\n      \"category\" : \"test\",\n      \"short description\" : \"Creates a quiddity from a plugin\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"myplugin\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Switcher Property Mapper\",\n      \"category\" : \"mapper\",\n      \"short description\" : \"map two properties, one being slave of the other\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"property-mapper\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Play To Audio Device (Pulse)\",\n      \"category\" : \"audio sink\",\n      \"short description\" : \"Inspecting Devices And Playing Audio To Outputs\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"pulsesink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Audio Device Source (Pulse)\",\n      \"category\" : \"audio source\",\n      \"short description\" : \"Inspecting Devices And Getting Audio From Inputs\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"pulsesrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"RTP Session\",\n      \"category\" : \"network\",\n      \"short description\" : \"RTP session manager\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"rtpsession\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Gstreamer Pipeline\",\n      \"category\" : \"runtime\",\n      \"short description\" : \"Complete pipeline container and scheduler\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"runtime\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata File Player\",\n      \"category\" : \"shmdata file player\",\n      \"short description\" : \"play file(s) recorded with shmdatatofile\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"shmfromfile\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata Recorder\",\n      \"category\" : \"file recorder\",\n      \"short description\" : \"record shmdata(s) to file(s)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"shmtofile\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"UDP Sender\",\n      \"category\" : \"udp sink\",\n      \"short description\" : \"send data stream with udp\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"udpsink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Media Player (URI)\",\n      \"category\" : \"uri source\",\n      \"short description\" : \"decode an URI and writes to shmdata(s)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"uridecodebin\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Capture (with v4l2)\",\n      \"category\" : \"video source\",\n      \"short description\" : \"Discover and use v4l2 supported capture cards and cameras\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"v4l2src\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Rate\",\n      \"category\" : \"video converter\",\n      \"short description\" : \"Adjusts video frame rate (video/x-raw-yuv)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"videorate\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Display\",\n      \"category\" : \"video sink\",\n      \"short description\" : \"Video window with minimal features\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"videosink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Test\",\n      \"category\" : \"video source\",\n      \"short description\" : \"Creates a test video stream\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"videotestsrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Vorbis Encoder\",\n      \"category\" : \"audio encoder\",\n      \"short description\" : \"Vorbis encoder (up to 255 interleaved channels)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"vorbis\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"H264 Encoder\",\n      \"category\" : \"video encoder\",\n      \"short description\" : \"H264 encoder\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"x264enc\",\n      \"author\" : \"Nicolas Bouillot\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 2188253,
      "arguments" : [
        "defaultrtp",
        "destinations-json"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"destinations\" : [\n  ]\n}"
      ]
    },
    {
      "command" : "get_quiddities_description",
      "calling time" : 2190527,
      "arguments" : [
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"quiddities\" : [\n    {\n      \"name\" : \"dico\",\n      \"class\" : \"dico\",\n      \"category\" : \"dictionary\",\n      \"long name\" : \"Dictionary\",\n      \"description\" : \"Dictionary of string key/values accessible through properties\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"soap\",\n      \"class\" : \"SOAPcontrolServer\",\n      \"category\" : \"control server\",\n      \"long name\" : \"Switcher Web Controler (SOAP)\",\n      \"description\" : \"getting switcher controled through SOAP webservices\",\n      \"license\" : \"GPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"single_runtime\",\n      \"class\" : \"runtime\",\n      \"category\" : \"runtime\",\n      \"long name\" : \"Gstreamer Pipeline\",\n      \"description\" : \"Complete pipeline container and scheduler\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"create_remove_spy\",\n      \"class\" : \"create_remove_spy\",\n      \"category\" : \"spy\",\n      \"long name\" : \"Quiddity Creation Inspector\",\n      \"description\" : \"spy manager for quidity creation and removal and convert into signals\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"defaultrtp\",\n      \"class\" : \"rtpsession\",\n      \"category\" : \"network\",\n      \"long name\" : \"RTP Session\",\n      \"description\" : \"RTP session manager\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"internal_logger\",\n      \"class\" : \"logger\",\n      \"category\" : \"log\",\n      \"long name\" : \"Switcher Logger\",\n      \"description\" : \"manage switcher logs and other glib log domains.\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 2192789,
      "arguments" : [
        "dico",
        "controlProperties"
      ],
      "vector argument" : [
      ],
      "results" : [
        ""
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 20101610,
      "arguments" : [
        "defaultrtp",
        "add_destination"
      ],
      "vector argument" : [
        "popo",
        "poseidon.local"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 20106165,
      "arguments" : [
        "SOAPcontrolClient",
        "soapClient-popo"
      ],
      "vector argument" : [
      ],
      "results" : [
        "soapClient-popo"
      ]
    },
    {
      "command" : "has_method",
      "calling time" : 20107845,
      "arguments" : [
        "soapClient-popo",
        "set_runtime"
      ],
      "vector argument" : [
      ],
      "results" : [
        "false"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 20107858,
      "arguments" : [
        "soapClient-popo"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"soapClient-popo\",\n  \"class\" : \"SOAPcontrolClient\",\n  \"category\" : \"control client\",\n  \"long name\" : \"Switcher Web Client (SOAP)\",\n  \"description\" : \"controling a switcher instance through SOAP webservices\",\n  \"license\" : \"GPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 20109483,
      "arguments" : [
        "soapClient-popo"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"soapClient-popo\",\n  \"class\" : \"SOAPcontrolClient\",\n  \"category\" : \"control client\",\n  \"long name\" : \"Switcher Web Client (SOAP)\",\n  \"description\" : \"controling a switcher instance through SOAP webservices\",\n  \"license\" : \"GPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 20112998,
      "arguments" : [
        "soapClient-popo",
        "set_remote_url"
      ],
      "vector argument" : [
        "http://poseidon.local:8085"
      ],
      "results" : [
        "false"
      ]
    },
    {
      "command" : "get_quiddities",
      "calling time" : 24116394,
      "arguments" : [
      ],
      "vector argument" : [
      ],
      "results" : [
        "dico",
        "soap",
        "soapClient-popo",
        "single_runtime",
        "create_remove_spy",
        "defaultrtp",
        "internal_logger"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 25365341,
      "arguments" : [
        "audiotestsrc",
        "audiotest"
      ],
      "vector argument" : [
      ],
      "results" : [
        "audiotest"
      ]
    },
    {
      "command" : "has_method",
      "calling time" : 25390856,
      "arguments" : [
        "audiotest",
        "set_runtime"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 25390874,
      "arguments" : [
        "audiotest",
        "set_runtime"
      ],
      "vector argument" : [
        "single_runtime"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 25392225,
      "arguments" : [
        "audiotest"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"audiotest\",\n  \"class\" : \"audiotestsrc\",\n  \"category\" : \"audio source\",\n  \"long name\" : \"Audio Test\",\n  \"description\" : \"Creates audio test signals\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 25394478,
      "arguments" : [
        "audiotest"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"audiotest\",\n  \"class\" : \"audiotestsrc\",\n  \"category\" : \"audio source\",\n  \"long name\" : \"Audio Test\",\n  \"description\" : \"Creates audio test signals\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "subscribe_signal",
      "calling time" : 25395790,
      "arguments" : [
        "signal_sub",
        "audiotest",
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
      "calling time" : 25397062,
      "arguments" : [
        "signal_sub",
        "audiotest",
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
      "calling time" : 25398265,
      "arguments" : [
        "signal_sub",
        "audiotest",
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
      "calling time" : 25399438,
      "arguments" : [
        "signal_sub",
        "audiotest",
        "on-method-removed"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_properties_description",
      "calling time" : 25400621,
      "arguments" : [
        "audiotest"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Volume\",\n      \"name\" : \"volume\",\n      \"short description\" : \"Volume of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"1\",\n      \"default value\" : \"0,8\"\n    },\n    {\n      \"long name\" : \"Frequency\",\n      \"name\" : \"freq\",\n      \"short description\" : \"Frequency of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"20000\",\n      \"default value\" : \"440\"\n    },\n    {\n      \"long name\" : \"Signal Form\",\n      \"name\" : \"wave\",\n      \"short description\" : \"Oscillator waveform\",\n      \"position category\" : \"\",\n      \"position weight\" : 120,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"sine\",\n        \"name\" : \"Sine\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"Sine\",\n          \"nick\" : \"sine\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"Square\",\n          \"nick\" : \"square\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"Saw\",\n          \"nick\" : \"saw\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Triangle\",\n          \"nick\" : \"triangle\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Silence\",\n          \"nick\" : \"silence\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"White uniform noise\",\n          \"nick\" : \"white-noise\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"Pink noise\",\n          \"nick\" : \"pink-noise\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"Sine table\",\n          \"nick\" : \"sine-table\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"Periodic Ticks\",\n          \"nick\" : \"ticks\",\n          \"value\" : \"8\"\n        },\n        {\n          \"name\" : \"White Gaussian noise\",\n          \"nick\" : \"gaussian-noise\",\n          \"value\" : \"9\"\n        },\n        {\n          \"name\" : \"Red (brownian) noise\",\n          \"nick\" : \"red-noise\",\n          \"value\" : \"10\"\n        },\n        {\n          \"name\" : \"Blue noise\",\n          \"nick\" : \"blue-noise\",\n          \"value\" : \"11\"\n        },\n        {\n          \"name\" : \"Violet noise\",\n          \"nick\" : \"violet-noise\",\n          \"value\" : \"12\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 25402993,
      "arguments" : [
        "prop_sub",
        "audiotest",
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
      "calling time" : 25404252,
      "arguments" : [
        "prop_sub",
        "audiotest",
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
      "calling time" : 25405435,
      "arguments" : [
        "prop_sub",
        "audiotest",
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
      "calling time" : 25406529,
      "arguments" : [
        "prop_sub",
        "audiotest",
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
      "calling time" : 25407629,
      "arguments" : [
        "prop_sub",
        "audiotest",
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
      "calling time" : 25408758,
      "arguments" : [
        "prop_sub",
        "audiotest",
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
      "calling time" : 25411200,
      "arguments" : [
        "audiotest",
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
      "calling time" : 25412698,
      "arguments" : [
        "audiotest"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"false\"\n    },\n    {\n      \"long name\" : \"Volume\",\n      \"name\" : \"volume\",\n      \"short description\" : \"Volume of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"1\",\n      \"default value\" : \"0,8\"\n    },\n    {\n      \"long name\" : \"Frequency\",\n      \"name\" : \"freq\",\n      \"short description\" : \"Frequency of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"20000\",\n      \"default value\" : \"440\"\n    },\n    {\n      \"long name\" : \"Signal Form\",\n      \"name\" : \"wave\",\n      \"short description\" : \"Oscillator waveform\",\n      \"position category\" : \"\",\n      \"position weight\" : 120,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"sine\",\n        \"name\" : \"Sine\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"Sine\",\n          \"nick\" : \"sine\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"Square\",\n          \"nick\" : \"square\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"Saw\",\n          \"nick\" : \"saw\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Triangle\",\n          \"nick\" : \"triangle\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Silence\",\n          \"nick\" : \"silence\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"White uniform noise\",\n          \"nick\" : \"white-noise\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"Pink noise\",\n          \"nick\" : \"pink-noise\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"Sine table\",\n          \"nick\" : \"sine-table\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"Periodic Ticks\",\n          \"nick\" : \"ticks\",\n          \"value\" : \"8\"\n        },\n        {\n          \"name\" : \"White Gaussian noise\",\n          \"nick\" : \"gaussian-noise\",\n          \"value\" : \"9\"\n        },\n        {\n          \"name\" : \"Red (brownian) noise\",\n          \"nick\" : \"red-noise\",\n          \"value\" : \"10\"\n        },\n        {\n          \"name\" : \"Blue noise\",\n          \"nick\" : \"blue-noise\",\n          \"value\" : \"11\"\n        },\n        {\n          \"name\" : \"Violet noise\",\n          \"nick\" : \"violet-noise\",\n          \"value\" : \"12\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 25415167,
      "arguments" : [
        "audiotest",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n  ]\n}"
      ]
    },
    {
      "command" : "get_methods_description",
      "calling time" : 25418370,
      "arguments" : [
        "audiotest"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"methods\" : [\n    {\n      \"long name\" : \"Set Runtime\",\n      \"name\" : \"set_runtime\",\n      \"description\" : \"attach a quiddity/segment to a runtime\",\n      \"position category\" : \"\",\n      \"position weight\" : 40,\n      \"return type\" : \"gboolean\",\n      \"return description\" : \"success or fail\",\n      \"arguments\" : [\n        {\n          \"long name\" : \"Runtime Name\",\n          \"name\" : \"runtime_name\",\n          \"description\" : \"the name of the runtime quiddity to attach with\",\n          \"type\" : \"gchararray\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "set_property",
      "calling time" : 26983581,
      "arguments" : [
        "audiotest",
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
      "calling time" : 26993739,
      "arguments" : [
        "audiotest",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n    {\n      \"path\" : \"/tmp/switcher_nodeserver_audiotest_audio\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 26995006,
      "arguments" : [
        "audiotest",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n    {\n      \"path\" : \"/tmp/switcher_nodeserver_audiotest_audio\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 26997255,
      "arguments" : [
        "audiotest",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n    {\n      \"path\" : \"/tmp/switcher_nodeserver_audiotest_audio\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "remove",
      "calling time" : 26998546,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audiotest_audio"
      ],
      "vector argument" : [
      ],
      "results" : [
        "false"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 26999695,
      "arguments" : [
        "fakesink",
        "vumeter_/tmp/switcher_nodeserver_audiotest_audio"
      ],
      "vector argument" : [
      ],
      "results" : [
        "vumeter_/tmp/switcher_nodeserver_audiotest_audio"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 27001534,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audiotest_audio",
        "connect"
      ],
      "vector argument" : [
        "/tmp/switcher_nodeserver_audiotest_audio"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "subscribe_property",
      "calling time" : 27002717,
      "arguments" : [
        "prop_sub",
        "vumeter_/tmp/switcher_nodeserver_audiotest_audio",
        "byte-rate"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 27003846,
      "arguments" : [
        "audiotest",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n    {\n      \"path\" : \"/tmp/switcher_nodeserver_audiotest_audio\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 27004972,
      "arguments" : [
        "audiotest",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n    {\n      \"path\" : \"/tmp/switcher_nodeserver_audiotest_audio\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "has_method",
      "calling time" : 27007672,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audiotest_audio",
        "set_runtime"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 27007680,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audiotest_audio",
        "set_runtime"
      ],
      "vector argument" : [
        "single_runtime"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 27009953,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audiotest_audio"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"vumeter_/tmp/switcher_nodeserver_audiotest_audio\",\n  \"class\" : \"fakesink\",\n  \"category\" : \"fakesink sink\",\n  \"long name\" : \"Shmdata Inspector\",\n  \"description\" : \"fakesink for testing purpose\",\n  \"license\" : \"LGPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 27999492,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audiotest_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "audio/x-raw-int, width=(int)16, rate=(int)44100, channels=(int)1, endianness=(int)1234, depth=(int)16, signed=(boolean)true"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 28001043,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audiotest_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "audio/x-raw-int, width=(int)16, rate=(int)44100, channels=(int)1, endianness=(int)1234, depth=(int)16, signed=(boolean)true"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 28002742,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audiotest_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "audio/x-raw-int, width=(int)16, rate=(int)44100, channels=(int)1, endianness=(int)1234, depth=(int)16, signed=(boolean)true"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 28004088,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audiotest_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "audio/x-raw-int, width=(int)16, rate=(int)44100, channels=(int)1, endianness=(int)1234, depth=(int)16, signed=(boolean)true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 28006434,
      "arguments" : [
        "audiotestpulsesink"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 28008073,
      "arguments" : [
        "audiotestpulsesink"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 34124473,
      "arguments" : [
        "soapClient-popo",
        "set_remote_url"
      ],
      "vector argument" : [
        "http://poseidon.local:8085"
      ],
      "results" : [
        "false"
      ]
    },
    {
      "command" : "get_quiddities",
      "calling time" : 38128837,
      "arguments" : [
      ],
      "vector argument" : [
      ],
      "results" : [
        "dico",
        "soap",
        "soapClient-popo",
        "single_runtime",
        "create_remove_spy",
        "defaultrtp",
        "audiotest",
        "vumeter_/tmp/switcher_nodeserver_audiotest_audio",
        "internal_logger"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 38130124,
      "arguments" : [
        "defaultrtp",
        "remove_destination"
      ],
      "vector argument" : [
        "popo"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "remove",
      "calling time" : 38132153,
      "arguments" : [
        "soapClient-popo"
      ],
      "vector argument" : [
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 38134971,
      "arguments" : [
        "soapClient-popo"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "get_classes_doc",
      "calling time" : 38610476,
      "arguments" : [
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"classes\" : [\n    {\n      \"long name\" : \"Switcher OSC Controler\",\n      \"category\" : \"control server\",\n      \"short description\" : \"OSCcontrolServer allows for managing switcher through OSC\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"OSCctl\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"OSC message to property\",\n      \"category\" : \"network converter\",\n      \"short description\" : \"OSCprop reveives OSC messages and updates associated property\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"OSCprop\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Switcher Web Client (SOAP)\",\n      \"category\" : \"control client\",\n      \"short description\" : \"controling a switcher instance through SOAP webservices\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"SOAPcontrolClient\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Switcher Web Controler (SOAP)\",\n      \"category\" : \"control server\",\n      \"short description\" : \"getting switcher controled through SOAP webservices\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"SOAPcontrolServer\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"AAC encoder\",\n      \"category\" : \"audio encoder\",\n      \"short description\" : \"AAC encoder (2 channels max)\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"aacenc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Audio Test\",\n      \"category\" : \"audio source\",\n      \"short description\" : \"Creates audio test signals\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"audiotestsrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Quiddity Creation Inspector\",\n      \"category\" : \"spy\",\n      \"short description\" : \"spy manager for quidity creation and removal and convert into signals\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"create_remove_spy\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata Decoder\",\n      \"category\" : \"decodebin2\",\n      \"short description\" : \"connect to a shmdata, decode it and write decoded frames to shmdata(s)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"decoder\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Deinterleave\",\n      \"category\" : \"video converter\",\n      \"short description\" : \"connect to an audio shmdata and split channels to multiple shmdata(s)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"deinterleave\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Dictionary\",\n      \"category\" : \"dictionary\",\n      \"short description\" : \"Dictionary of string key/values accessible through properties\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"dico\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata From Software\",\n      \"category\" : \"fake source\",\n      \"short description\" : \"add a shmdata from an other software\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"fakeshmsrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata Inspector\",\n      \"category\" : \"fakesink sink\",\n      \"short description\" : \"fakesink for testing purpose\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"fakesink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"File SDP Receiver\",\n      \"category\" : \"network\",\n      \"short description\" : \"get raw stream from sdp file\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"filesdp\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"GenICam Camera\",\n      \"category\" : \"genicam video\",\n      \"short description\" : \"Genicam video source using the Aravis library\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"genicam\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"GStreamer Pipeline\",\n      \"category\" : \"source\",\n      \"short description\" : \"GStreamer (src) pipeline description to a *single* shmdata\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"gstsrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"GStreamer Video Pipeline\",\n      \"category\" : \"video source\",\n      \"short description\" : \"GStreamer (src) video pipeline description to a *single* shmdata\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"gstvideosrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Display\",\n      \"category\" : \"video sink\",\n      \"short description\" : \"Video window with fullscreen\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"gtkvideosink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"HTTP/SDP Receiver\",\n      \"category\" : \"network\",\n      \"short description\" : \"get raw stream from sdp file distributed with http\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"httpsdp\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"HTTP/SDP Decoder\",\n      \"category\" : \"network source\",\n      \"short description\" : \"decode an sdp-described stream deliver through http and make shmdatas\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"httpsdpdec\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Jack Audio\",\n      \"category\" : \"test\",\n      \"short description\" : \"get audio from jack\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"jackaudiosrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Audio Display (with Jack Audio)\",\n      \"category\" : \"audio sink\",\n      \"short description\" : \"Audio display with minimal features\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"jacksink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"JPEG Encoder\",\n      \"category\" : \"video encoder\",\n      \"short description\" : \"JPEG encoder\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"jpegenc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Switcher Logger\",\n      \"category\" : \"log\",\n      \"short description\" : \"manage switcher logs and other glib log domains.\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"logger\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Midi (PortMidiSink)\",\n      \"category\" : \"midi sink\",\n      \"short description\" : \"shmdata to midi\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"midisink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Midi (PortMidi)\",\n      \"category\" : \"midi source\",\n      \"short description\" : \"midi to shmdata and properties\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"midisrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"My Plugin\",\n      \"category\" : \"test\",\n      \"short description\" : \"Creates a quiddity from a plugin\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"myplugin\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Switcher Property Mapper\",\n      \"category\" : \"mapper\",\n      \"short description\" : \"map two properties, one being slave of the other\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"property-mapper\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Play To Audio Device (Pulse)\",\n      \"category\" : \"audio sink\",\n      \"short description\" : \"Inspecting Devices And Playing Audio To Outputs\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"pulsesink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Audio Device Source (Pulse)\",\n      \"category\" : \"audio source\",\n      \"short description\" : \"Inspecting Devices And Getting Audio From Inputs\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"pulsesrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"RTP Session\",\n      \"category\" : \"network\",\n      \"short description\" : \"RTP session manager\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"rtpsession\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Gstreamer Pipeline\",\n      \"category\" : \"runtime\",\n      \"short description\" : \"Complete pipeline container and scheduler\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"runtime\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata File Player\",\n      \"category\" : \"shmdata file player\",\n      \"short description\" : \"play file(s) recorded with shmdatatofile\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"shmfromfile\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata Recorder\",\n      \"category\" : \"file recorder\",\n      \"short description\" : \"record shmdata(s) to file(s)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"shmtofile\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"UDP Sender\",\n      \"category\" : \"udp sink\",\n      \"short description\" : \"send data stream with udp\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"udpsink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Media Player (URI)\",\n      \"category\" : \"uri source\",\n      \"short description\" : \"decode an URI and writes to shmdata(s)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"uridecodebin\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Capture (with v4l2)\",\n      \"category\" : \"video source\",\n      \"short description\" : \"Discover and use v4l2 supported capture cards and cameras\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"v4l2src\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Rate\",\n      \"category\" : \"video converter\",\n      \"short description\" : \"Adjusts video frame rate (video/x-raw-yuv)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"videorate\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Display\",\n      \"category\" : \"video sink\",\n      \"short description\" : \"Video window with minimal features\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"videosink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Test\",\n      \"category\" : \"video source\",\n      \"short description\" : \"Creates a test video stream\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"videotestsrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Vorbis Encoder\",\n      \"category\" : \"audio encoder\",\n      \"short description\" : \"Vorbis encoder (up to 255 interleaved channels)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"vorbis\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"H264 Encoder\",\n      \"category\" : \"video encoder\",\n      \"short description\" : \"H264 encoder\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"x264enc\",\n      \"author\" : \"Nicolas Bouillot\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 38635534,
      "arguments" : [
        "defaultrtp",
        "destinations-json"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"destinations\" : [\n  ]\n}"
      ]
    },
    {
      "command" : "get_quiddities_description",
      "calling time" : 38637196,
      "arguments" : [
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"quiddities\" : [\n    {\n      \"name\" : \"dico\",\n      \"class\" : \"dico\",\n      \"category\" : \"dictionary\",\n      \"long name\" : \"Dictionary\",\n      \"description\" : \"Dictionary of string key/values accessible through properties\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"soap\",\n      \"class\" : \"SOAPcontrolServer\",\n      \"category\" : \"control server\",\n      \"long name\" : \"Switcher Web Controler (SOAP)\",\n      \"description\" : \"getting switcher controled through SOAP webservices\",\n      \"license\" : \"GPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"single_runtime\",\n      \"class\" : \"runtime\",\n      \"category\" : \"runtime\",\n      \"long name\" : \"Gstreamer Pipeline\",\n      \"description\" : \"Complete pipeline container and scheduler\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"create_remove_spy\",\n      \"class\" : \"create_remove_spy\",\n      \"category\" : \"spy\",\n      \"long name\" : \"Quiddity Creation Inspector\",\n      \"description\" : \"spy manager for quidity creation and removal and convert into signals\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"defaultrtp\",\n      \"class\" : \"rtpsession\",\n      \"category\" : \"network\",\n      \"long name\" : \"RTP Session\",\n      \"description\" : \"RTP session manager\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"audiotest\",\n      \"class\" : \"audiotestsrc\",\n      \"category\" : \"audio source\",\n      \"long name\" : \"Audio Test\",\n      \"description\" : \"Creates audio test signals\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"vumeter_/tmp/switcher_nodeserver_audiotest_audio\",\n      \"class\" : \"fakesink\",\n      \"category\" : \"fakesink sink\",\n      \"long name\" : \"Shmdata Inspector\",\n      \"description\" : \"fakesink for testing purpose\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"internal_logger\",\n      \"class\" : \"logger\",\n      \"category\" : \"log\",\n      \"long name\" : \"Switcher Logger\",\n      \"description\" : \"manage switcher logs and other glib log domains.\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_properties_description",
      "calling time" : 38638748,
      "arguments" : [
        "audiotest"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"properties\" : [\n    {\n      \"long name\" : \"Shmdata Writers\",\n      \"name\" : \"shmdata-writers\",\n      \"short description\" : \"json formated shmdata writers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 0,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_writers\\\" : [\\n    {\\n      \\\"path\\\" : \\\"/tmp/switcher_nodeserver_audiotest_audio\\\"\\n    }\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Shmdata Readers\",\n      \"name\" : \"shmdata-readers\",\n      \"short description\" : \"json formated shmdata readers description\",\n      \"position category\" : \"\",\n      \"position weight\" : 20,\n      \"writable\" : \"false\",\n      \"type\" : \"string\",\n      \"default value\" : \"{\\n  \\\"shmdata_readers\\\" : [\\n  ]\\n}\"\n    },\n    {\n      \"long name\" : \"Started\",\n      \"name\" : \"started\",\n      \"short description\" : \"started or not\",\n      \"position category\" : \"\",\n      \"position weight\" : 60,\n      \"writable\" : \"true\",\n      \"type\" : \"boolean\",\n      \"default value\" : \"true\"\n    },\n    {\n      \"long name\" : \"Volume\",\n      \"name\" : \"volume\",\n      \"short description\" : \"Volume of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 80,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"1\",\n      \"default value\" : \"0,8\"\n    },\n    {\n      \"long name\" : \"Frequency\",\n      \"name\" : \"freq\",\n      \"short description\" : \"Frequency of test signal\",\n      \"position category\" : \"\",\n      \"position weight\" : 100,\n      \"writable\" : \"true\",\n      \"type\" : \"double\",\n      \"minimum\" : \"0\",\n      \"maximum\" : \"20000\",\n      \"default value\" : \"440\"\n    },\n    {\n      \"long name\" : \"Signal Form\",\n      \"name\" : \"wave\",\n      \"short description\" : \"Oscillator waveform\",\n      \"position category\" : \"\",\n      \"position weight\" : 120,\n      \"writable\" : \"true\",\n      \"type\" : \"enum\",\n      \"default value\" : {\n        \"value\" : \"0\",\n        \"nick\" : \"sine\",\n        \"name\" : \"Sine\"\n      },\n      \"values\" : [\n        {\n          \"name\" : \"Sine\",\n          \"nick\" : \"sine\",\n          \"value\" : \"0\"\n        },\n        {\n          \"name\" : \"Square\",\n          \"nick\" : \"square\",\n          \"value\" : \"1\"\n        },\n        {\n          \"name\" : \"Saw\",\n          \"nick\" : \"saw\",\n          \"value\" : \"2\"\n        },\n        {\n          \"name\" : \"Triangle\",\n          \"nick\" : \"triangle\",\n          \"value\" : \"3\"\n        },\n        {\n          \"name\" : \"Silence\",\n          \"nick\" : \"silence\",\n          \"value\" : \"4\"\n        },\n        {\n          \"name\" : \"White uniform noise\",\n          \"nick\" : \"white-noise\",\n          \"value\" : \"5\"\n        },\n        {\n          \"name\" : \"Pink noise\",\n          \"nick\" : \"pink-noise\",\n          \"value\" : \"6\"\n        },\n        {\n          \"name\" : \"Sine table\",\n          \"nick\" : \"sine-table\",\n          \"value\" : \"7\"\n        },\n        {\n          \"name\" : \"Periodic Ticks\",\n          \"nick\" : \"ticks\",\n          \"value\" : \"8\"\n        },\n        {\n          \"name\" : \"White Gaussian noise\",\n          \"nick\" : \"gaussian-noise\",\n          \"value\" : \"9\"\n        },\n        {\n          \"name\" : \"Red (brownian) noise\",\n          \"nick\" : \"red-noise\",\n          \"value\" : \"10\"\n        },\n        {\n          \"name\" : \"Blue noise\",\n          \"nick\" : \"blue-noise\",\n          \"value\" : \"11\"\n        },\n        {\n          \"name\" : \"Violet noise\",\n          \"nick\" : \"violet-noise\",\n          \"value\" : \"12\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 38640269,
      "arguments" : [
        "audiotest",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n    {\n      \"path\" : \"/tmp/switcher_nodeserver_audiotest_audio\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 38641423,
      "arguments" : [
        "audiotest",
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
      "calling time" : 38642544,
      "arguments" : [
        "audiotest",
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
      "calling time" : 38643643,
      "arguments" : [
        "audiotest",
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
      "calling time" : 38644753,
      "arguments" : [
        "audiotest",
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
      "calling time" : 38645858,
      "arguments" : [
        "audiotest",
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
      "calling time" : 38646977,
      "arguments" : [
        "audiotest"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"methods\" : [\n    {\n      \"long name\" : \"Set Runtime\",\n      \"name\" : \"set_runtime\",\n      \"description\" : \"attach a quiddity/segment to a runtime\",\n      \"position category\" : \"\",\n      \"position weight\" : 40,\n      \"return type\" : \"gboolean\",\n      \"return description\" : \"success or fail\",\n      \"arguments\" : [\n        {\n          \"long name\" : \"Runtime Name\",\n          \"name\" : \"runtime_name\",\n          \"description\" : \"the name of the runtime quiddity to attach with\",\n          \"type\" : \"gchararray\"\n        }\n      ]\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 38650893,
      "arguments" : [
        "dico",
        "controlProperties"
      ],
      "vector argument" : [
      ],
      "results" : [
        ""
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 38652876,
      "arguments" : [
        "audiotest",
        "shmdata-writers"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"shmdata_writers\" : [\n    {\n      \"path\" : \"/tmp/switcher_nodeserver_audiotest_audio\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 39660031,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audiotest_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "audio/x-raw-int, width=(int)16, rate=(int)44100, channels=(int)1, endianness=(int)1234, depth=(int)16, signed=(boolean)true"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 39661506,
      "arguments" : [
        "vumeter_/tmp/switcher_nodeserver_audiotest_audio",
        "caps"
      ],
      "vector argument" : [
      ],
      "results" : [
        "audio/x-raw-int, width=(int)16, rate=(int)44100, channels=(int)1, endianness=(int)1234, depth=(int)16, signed=(boolean)true"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 39665351,
      "arguments" : [
        "audiotestpulsesink"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{ \"error\":\"quiddity not found\"}"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 48232023,
      "arguments" : [
        "defaultrtp",
        "add_destination"
      ],
      "vector argument" : [
        "popo",
        "poseidon.local"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 48242760,
      "arguments" : [
        "SOAPcontrolClient",
        "soapClient-popo"
      ],
      "vector argument" : [
      ],
      "results" : [
        "soapClient-popo"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 48244369,
      "arguments" : [
        "soapClient-popo"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"soapClient-popo\",\n  \"class\" : \"SOAPcontrolClient\",\n  \"category\" : \"control client\",\n  \"long name\" : \"Switcher Web Client (SOAP)\",\n  \"description\" : \"controling a switcher instance through SOAP webservices\",\n  \"license\" : \"GPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "has_method",
      "calling time" : 48245591,
      "arguments" : [
        "soapClient-popo",
        "set_runtime"
      ],
      "vector argument" : [
      ],
      "results" : [
        "false"
      ]
    },
    {
      "command" : "get_quiddity_description",
      "calling time" : 48245981,
      "arguments" : [
        "soapClient-popo"
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"name\" : \"soapClient-popo\",\n  \"class\" : \"SOAPcontrolClient\",\n  \"category\" : \"control client\",\n  \"long name\" : \"Switcher Web Client (SOAP)\",\n  \"description\" : \"controling a switcher instance through SOAP webservices\",\n  \"license\" : \"GPL\",\n  \"author\" : \"Nicolas Bouillot\"\n}"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 48252240,
      "arguments" : [
        "soapClient-popo",
        "set_remote_url"
      ],
      "vector argument" : [
        "http://poseidon.local:2020"
      ],
      "results" : [
        "true"
      ]
    },
    {
      "command" : "invoke",
      "calling time" : 48260918,
      "arguments" : [
        "soapClient-popo",
        "create"
      ],
      "vector argument" : [
        "httpsdpdec",
        "poseidon"
      ],
      "results" : [
        "true"
      ]
    }
  ]
}