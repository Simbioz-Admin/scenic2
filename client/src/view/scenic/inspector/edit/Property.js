"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'view/scenic/inspector/edit/property/Number',
    'view/scenic/inspector/edit/property/Bool',
    'view/scenic/inspector/edit/property/String',
    'view/scenic/inspector/edit/property/Select',
    'text!template/scenic/inspector/edit/property.html'
], function ( _, Backbone, Marionette, NumberView, BoolView, StringView, SelectView, PropertyTemplate ) {

    /**
     * Property View
     *
     * @constructor
     * @extends module:Marionette.LayoutView
     */
    var Property = Marionette.LayoutView.extend( {
        template: _.template( PropertyTemplate ),
        tagName: 'li',
        className: 'property',

        regions: {
            field: '.field'
        },

        /**
         * Initialize
         */
        initialize: function( ) {

        },

        /**
         * On Show
         *
         * TODO: Read-only properties
         * <% if(property.writable == "false") { %>
         * <h3 class="info" title="<%=property['short description']%><br><%=moreInfo%>" ><%=property['long name']%></h3>
         * <%=property["default value"]%>
         * <% } %>
         */
        onShow: function() {
            var view = null;
            switch( this.model.get('type')) {
                case 'float':
                case 'int':
                case 'double':
                case 'uint':
                    view = new NumberView({model:this.model});
                    break;
                case 'boolean':
                    view = new BoolView({model:this.model});
                    break;
                case 'enum':
                    view = new SelectView({model:this.model});
                    break;
                case 'string':
                    view = new StringView({model:this.model});
                    break;
                default:
                    console.warn( 'View not found for property ' + this.model.get('name') + ' type ' + this.model.get('type'));
                    break
            }
            if ( view ) {
                this.showChildView( 'field', view );
            }
        }
    } );

    return Property;
} );