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