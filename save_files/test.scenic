{
  "history" : [
    {
      "command" : "create_nick_named",
      "calling time" : 490105,
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
      "command" : "has_method",
      "calling time" : 494970,
      "arguments" : [
        "defaultrtp",
        "set_runtime"
      ],
      "vector argument" : [
      ],
      "results" : [
        "false"
      ]
    },
    {
      "command" : "create_nick_named",
      "calling time" : 494990,
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
      "calling time" : 496214,
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
      "command" : "invoke",
      "calling time" : 496263,
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
      "calling time" : 497074,
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
      "command" : "has_method",
      "calling time" : 498394,
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
      "command" : "invoke",
      "calling time" : 498493,
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
      "calling time" : 499111,
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
      "calling time" : 499542,
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
      "calling time" : 523506,
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
      "calling time" : 524143,
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
      "calling time" : 524460,
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
      "calling time" : 2544748,
      "arguments" : [
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"classes\" : [\n    {\n      \"long name\" : \"Switcher OSC Controler\",\n      \"category\" : \"control server\",\n      \"short description\" : \"OSCcontrolServer allows for managing switcher through OSC\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"OSCctl\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"OSC message to property\",\n      \"category\" : \"network converter\",\n      \"short description\" : \"OSCprop reveives OSC messages and updates associated property\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"OSCprop\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Switcher Web Client (SOAP)\",\n      \"category\" : \"control client\",\n      \"short description\" : \"controling a switcher instance through SOAP webservices\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"SOAPcontrolClient\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Switcher Web Controler (SOAP)\",\n      \"category\" : \"control server\",\n      \"short description\" : \"getting switcher controled through SOAP webservices\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"SOAPcontrolServer\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"AAC encoder\",\n      \"category\" : \"audio encoder\",\n      \"short description\" : \"AAC encoder (2 channels max)\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"aacenc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Audio Test\",\n      \"category\" : \"audio source\",\n      \"short description\" : \"Creates audio test signals\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"audiotestsrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Quiddity Creation Inspector\",\n      \"category\" : \"spy\",\n      \"short description\" : \"spy manager for quidity creation and removal and convert into signals\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"create_remove_spy\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata Decoder\",\n      \"category\" : \"decodebin2\",\n      \"short description\" : \"connect to a shmdata, decode it and write decoded frames to shmdata(s)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"decoder\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Deinterleave\",\n      \"category\" : \"video converter\",\n      \"short description\" : \"connect to an audio shmdata and split channels to multiple shmdata(s)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"deinterleave\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Dictionary\",\n      \"category\" : \"dictionary\",\n      \"short description\" : \"Dictionary of string key/values accessible through properties\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"dico\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata From Software\",\n      \"category\" : \"fake source\",\n      \"short description\" : \"add a shmdata from an other software\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"fakeshmsrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata Inspector\",\n      \"category\" : \"fakesink sink\",\n      \"short description\" : \"fakesink for testing purpose\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"fakesink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"File SDP Receiver\",\n      \"category\" : \"network\",\n      \"short description\" : \"get raw stream from sdp file\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"filesdp\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"GenICam Camera\",\n      \"category\" : \"genicam video\",\n      \"short description\" : \"Genicam video source using the Aravis library\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"genicam\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"GStreamer Pipeline\",\n      \"category\" : \"source\",\n      \"short description\" : \"GStreamer (src) pipeline description to a *single* shmdata\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"gstsrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"GStreamer Video Pipeline\",\n      \"category\" : \"video source\",\n      \"short description\" : \"GStreamer (src) video pipeline description to a *single* shmdata\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"gstvideosrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Display\",\n      \"category\" : \"video sink\",\n      \"short description\" : \"Video window with fullscreen\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"gtkvideosink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"HTTP/SDP Receiver\",\n      \"category\" : \"network\",\n      \"short description\" : \"get raw stream from sdp file distributed with http\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"httpsdp\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"HTTP/SDP Decoder\",\n      \"category\" : \"network source\",\n      \"short description\" : \"decode an sdp-described stream deliver through http and make shmdatas\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"httpsdpdec\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Jack Audio\",\n      \"category\" : \"test\",\n      \"short description\" : \"get audio from jack\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"jackaudiosrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Audio Display (with Jack Audio)\",\n      \"category\" : \"audio sink\",\n      \"short description\" : \"Audio display with minimal features\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"jacksink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"JPEG Encoder\",\n      \"category\" : \"video encoder\",\n      \"short description\" : \"JPEG encoder\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"jpegenc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Switcher Logger\",\n      \"category\" : \"log\",\n      \"short description\" : \"manage switcher logs and other glib log domains.\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"logger\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Midi (PortMidiSink)\",\n      \"category\" : \"midi sink\",\n      \"short description\" : \"shmdata to midi\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"midisink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Midi (PortMidi)\",\n      \"category\" : \"midi source\",\n      \"short description\" : \"midi to shmdata and properties\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"midisrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"My Plugin\",\n      \"category\" : \"test\",\n      \"short description\" : \"Creates a quiddity from a plugin\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"myplugin\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Switcher Property Mapper\",\n      \"category\" : \"mapper\",\n      \"short description\" : \"map two properties, one being slave of the other\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"property-mapper\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Play To Audio Device (Pulse)\",\n      \"category\" : \"audio sink\",\n      \"short description\" : \"Inspecting Devices And Playing Audio To Outputs\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"pulsesink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Audio Device Source (Pulse)\",\n      \"category\" : \"audio source\",\n      \"short description\" : \"Inspecting Devices And Getting Audio From Inputs\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"pulsesrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"RTP Session\",\n      \"category\" : \"network\",\n      \"short description\" : \"RTP session manager\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"rtpsession\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata File Player\",\n      \"category\" : \"shmdata file player\",\n      \"short description\" : \"play file(s) recorded with shmdatatofile\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"shmfromfile\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Shmdata Recorder\",\n      \"category\" : \"file recorder\",\n      \"short description\" : \"record shmdata(s) to file(s)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"shmtofile\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"UDP Sender\",\n      \"category\" : \"udp sink\",\n      \"short description\" : \"send data stream with udp\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"udpsink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Media Player (URI)\",\n      \"category\" : \"uri source\",\n      \"short description\" : \"decode an URI and writes to shmdata(s)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"uridecodebin\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Capture (with v4l2)\",\n      \"category\" : \"video source\",\n      \"short description\" : \"Discover and use v4l2 supported capture cards and cameras\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"v4l2src\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Rate\",\n      \"category\" : \"video converter\",\n      \"short description\" : \"Adjusts video frame rate (video/x-raw-yuv)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"videorate\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Display\",\n      \"category\" : \"video sink\",\n      \"short description\" : \"Video window with minimal features\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"videosink\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Video Test\",\n      \"category\" : \"video source\",\n      \"short description\" : \"Creates a test video stream\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"videotestsrc\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"Vorbis Encoder\",\n      \"category\" : \"audio encoder\",\n      \"short description\" : \"Vorbis encoder (up to 255 interleaved channels)\",\n      \"license\" : \"LGPL\",\n      \"class name\" : \"vorbis\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"long name\" : \"H264 Encoder\",\n      \"category\" : \"video encoder\",\n      \"short description\" : \"H264 encoder\",\n      \"license\" : \"GPL\",\n      \"class name\" : \"x264enc\",\n      \"author\" : \"Nicolas Bouillot\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 2563600,
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
      "calling time" : 2564231,
      "arguments" : [
      ],
      "vector argument" : [
      ],
      "results" : [
        "{\n  \"quiddities\" : [\n    {\n      \"name\" : \"dico\",\n      \"class\" : \"dico\",\n      \"category\" : \"dictionary\",\n      \"long name\" : \"Dictionary\",\n      \"description\" : \"Dictionary of string key/values accessible through properties\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"soap\",\n      \"class\" : \"SOAPcontrolServer\",\n      \"category\" : \"control server\",\n      \"long name\" : \"Switcher Web Controler (SOAP)\",\n      \"description\" : \"getting switcher controled through SOAP webservices\",\n      \"license\" : \"GPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"create_remove_spy\",\n      \"class\" : \"create_remove_spy\",\n      \"category\" : \"spy\",\n      \"long name\" : \"Quiddity Creation Inspector\",\n      \"description\" : \"spy manager for quidity creation and removal and convert into signals\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"defaultrtp\",\n      \"class\" : \"rtpsession\",\n      \"category\" : \"network\",\n      \"long name\" : \"RTP Session\",\n      \"description\" : \"RTP session manager\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    },\n    {\n      \"name\" : \"internal_logger\",\n      \"class\" : \"logger\",\n      \"category\" : \"log\",\n      \"long name\" : \"Switcher Logger\",\n      \"description\" : \"manage switcher logs and other glib log domains.\",\n      \"license\" : \"LGPL\",\n      \"author\" : \"Nicolas Bouillot\"\n    }\n  ]\n}"
      ]
    },
    {
      "command" : "get_property",
      "calling time" : 2565010,
      "arguments" : [
        "dico",
        "controlProperties"
      ],
      "vector argument" : [
      ],
      "results" : [
        ""
      ]
    }
  ]
}