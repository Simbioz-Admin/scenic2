define(

    /** 
     *	Model of Table
     *	Table is for organise in different table the source and destination
     *	@exports Models/table
     */

    [
        'underscore',
        'backbone',
        'views/table',
        'views/source', 'views/destination',
    ],

    function(_, Backbone, ViewTable, ViewSource, ViewDestination) {

        /** 
         *	@constructor
         *  @requires Underscore
         *  @requires Backbone
         *	@requires ViewTable
         *  @augments module:Backbone.Model
         */

        var TableModel = Backbone.Model.extend(

            /**
             *	@lends module: Models/table~TableModel.prototype
             */

            {
                idAttribute: "name",
                defaults: {
                    "name": null,
                    "type": null,
                    "description": null,
                    "menus": [],
                    "collectionSources": null,
                    "collectionDestinations": null
                },

                /* Called when the table is initialized and create a view */

                initialize: function() {

                    /* Create collection source and destination */
                    /* we check if it's already a collection */
                    if (this.get("sources").models) {
                        this.set("collectionSources", this.get("sources"));
                    } else {
                        var quiddsSources = this.get_quidds("sources");
                        this.set("collectionSources", new Backbone.Collection);
                        this.get("collectionSources").add(quiddsSources);
                    }

                    if (this.get("destinations").models) {
                        this.set("collectionDestinations", this.get("destinations"));
                    } else {
                        var quiddsDestinations = this.get_quidds("destinations");
                        this.set("collectionDestinations", new Backbone.Collection);
                        this.get("collectionDestinations").add(quiddsDestinations);

                    }

                    /* Create view for the table and associate this model */

                    var viewTable = new ViewTable({
                        model: this
                    });

                    // console.log("classes", this.classes_authorized("sources"));
                },

                /* Return the quiddities authorize baded on tyoe (source or destination) */

                get_quidds: function(orientation) {

                    /* parse global collection quidds contains all quidds already created for return just what you want */
                    if (this.get(orientation)) {
                        var quiddsSelect = this.get(orientation).select;
                        return collections.quidds.SelectQuidds(quiddsSelect);
                    }
                },

                /* Return list of quiddity you can created for this table */

                classes_authorized: function(orientation) {

                    var classes, that = this;

                    if (!this.get(orientation)) return null;

                    /* if specified category selected */
                    if (this.get(orientation).select) {
                        classes = collections.classesDoc.getByCategory(this.get(orientation).select);
                    } else {
                        classes = collections.classesDoc.toJSON();
                    }

                    if (this.get(orientation).exclude) {
                        classes = _.filter(classes, function(clas) {
                            if (!_.contains(that.get(orientation).exclude, clas["category"])) return clas
                        });
                    }

                    return classes;

                },
                is_authorize: function(orientation, quiddClass) {
                    var authorized = _.find(this.classes_authorized(orientation), function(clas) {
                        return clas["class name"] == quiddClass;
                    });

                    return (authorized ? true : false);
                },

                /* determine if we add the quidd to the table and create view for */

                add_to_table: function(quidd) {

                    /* if we found class in authorized we add to the collection et create view */

                    if (this.is_authorize("sources", quidd.get("class"))) {
                        /* insert in collection */
                        this.get("collectionSources").add(quidd);
                        /* Create a view */
                        new ViewSource({
                            model: quidd,
                            table: this.get("type")
                        });
                    }

                    if (this.is_authorize("destinations", quidd.get("class"))) {
                        /* insert in collection destination of this table */
                        this.get("collectionDestinations").add(quidd);
                        /* Create a view */
                        new ViewDestination({
                            model: quidd,
                            table: this.get("type")
                        });
                    }

                },

                /* Called for know if the quiddity can be added to the table */

                // addToTable: function(type, value) {

                // 	// var addToTable = false
                // 	// if(this.get("menus")[type].byCategory){
                // 	// 	var	select = this.get("menus")[type].byCategory.select
                // 	// 	,	exclude = this.get("menus")[type].byCategory.excludes;

                // 	// 	if (select && _.contains(select, value)) addToTable = true;
                // 	// 	if (exclude && _.contains(exclude, value)) {
                // 	// 		addToTable = false;
                // 	// 	} else if (!select) {
                // 	// 		addToTable = true;
                // 	// 	}
                // 	// }
                // 	// return addToTable;

                // },

            });

        return TableModel;
    })