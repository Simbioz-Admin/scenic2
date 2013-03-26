define([
	'underscore',
	'backbone',
	'models/class_doc'
	],function(_, Backbone, ClassDocModel){

		var ClassesDocCollection = Backbone.Collection.extend({
			model : ClassDocModel,
			url : '/classes_doc/',
			parse : function(results, xhr){
		        return results.classes;
		    },
		    initialize : function(){
		    	console.log("init collection classesDoc");
		    },
		    getProperties : function(className, callback){
		    	socket.emit("getPropertiesOfClass", className, function(propertiesOfClass){
		    		callback(propertiesOfClass);
		    	});
		    },
		    getPropertiesWithout: function(className, excludes, callback){
		    	var properties = {};
		    	socket.emit("getPropertiesOfClass", className, function(propertiesOfClass){
		    
		    		_.filter(propertiesOfClass, function(property, index){
		    			var exclude = $.inArray(property.name, excludes);
		    			if(exclude < 0 ) properties[index] = property;
		    		});
		    		callback(properties);
		    	});
		    },

		    getByCategory : function(category){
		    	filtered = this.filter(function(classDoc) {
		    		if(classDoc.get("category").indexOf(category) >= 0){
		    			return classDoc;
		    		}
			    });
		    	return new ClassesDocCollection(filtered);
		    }
		});

		return ClassesDocCollection;
	})