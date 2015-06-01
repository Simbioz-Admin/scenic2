var chai      = require( "chai" );
var sinon     = require( "sinon" );
var sinonChai = require( "sinon-chai" );
var should    = chai.should();
chai.use( sinonChai );

module.exports = function () {
    return {
        register_log_callback:      sinon.stub(),
        register_prop_callback:     sinon.stub(),
        register_signal_callback:   sinon.stub(),
        subscribe_to_signal:        sinon.stub(),
        subscribe_to_property:      sinon.stub(),
        create:                     sinon.stub(),
        remove:                     sinon.stub(),
        set_property_value:         sinon.stub(),
        invoke:                     sinon.stub(),
        load_history_from_scratch:  sinon.stub(),
        close:                      sinon.stub(),
        save_history:               sinon.stub(),
        get_quiddity_description:   sinon.stub(),
        get_properties_description: sinon.stub(),
        get_property_description:   sinon.stub(),
        get_property_value:         sinon.stub(),
        get_info:                   sinon.stub(),
        get_classes_doc:            sinon.stub(),
        get_quiddities_description: sinon.stub(),
        get_methods_description:    sinon.stub(),
        get_method_description:     sinon.stub(),
        has_quiddity:               sinon.stub()
    }
};