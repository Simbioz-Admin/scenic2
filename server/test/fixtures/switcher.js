var chai      = require( "chai" );
var sinon     = require( "sinon" );
var sinonChai = require( "sinon-chai" );
var should    = chai.should();
chai.use( sinonChai );

QuiddityManager = function () {
    this.register_log_callback      = sinon.stub();
    this.register_prop_callback     = sinon.stub();
    this.register_signal_callback   = sinon.stub();
    this.subscribe_to_signal        = sinon.stub();
    this.subscribe_to_property      = sinon.stub();
    this.create                     = sinon.stub();
    this.remove                     = sinon.stub();
    this.set_property_value         = sinon.stub();
    this.invoke                     = sinon.stub();
    this.load_history_from_scratch  = sinon.stub();
    this.close                      = sinon.stub();
    this.save_history               = sinon.stub();
    this.get_quiddity_description   = sinon.stub();
    this.get_properties_description = sinon.stub();
    this.get_property_description   = sinon.stub();
    this.get_property_value         = sinon.stub();
    this.get_info                   = sinon.stub();
    this.get_classes_doc            = sinon.stub();
    this.get_quiddities_description = sinon.stub();
    this.get_methods_description    = sinon.stub();
    this.get_method_description     = sinon.stub();
    this.has_quiddity               = sinon.stub();
};

module.exports = { QuiddityManager: QuiddityManager };