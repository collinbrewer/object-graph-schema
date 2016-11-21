/**
* ObjectGraphSchema.js
* A library for describing, manipulating and querying entity schemas
*/

var EntitySchema = require('./entity-schema.js');

var index = function (o, entityDefinitions) {
	var entitiesByName = {};
	var entity;
	var index = {
		'entitiesByName': entitiesByName,
		'entities': entityDefinitions.map((entityDefinition) => {
			entity = new EntitySchema(entityDefinition, o);
			entitiesByName[entityDefinition.name] = entity;

			return entity;
		})
	};

	o.index = index;
};

/**
 * ObjectGraphSchema
 */
function ObjectGraphSchema (definition) {
	this.definition = definition;

	index(this, definition.entities);
}

ObjectGraphSchema.prototype.getEntities = function () {
	return this.index.entities;
};

ObjectGraphSchema.prototype.getEntitiesByName = function () {
	return this.index.entitiesByName;
};

ObjectGraphSchema.prototype.getEntity = function (entityName) {
	return this.index.entitiesByName[entityName];
};

ObjectGraphSchema.prototype.getProperties = function () {
	var properties = this.properties;

	if (!properties) {
		properties = [];

		this.getEntities().forEach((entity) => {
			properties = properties.concat(entity.getProperties());
		});

		this.properties = properties;
	}

	return properties;
};

// ObjectGraphSchema.prototype.getRelationshipsWithDestinationEntity=function(entity){
//
//	 var entityName=typeof(entity)==="string" ? entity : entity.getName();
//
//	 if(!this.relationshipsWithDestinationEntity[entityName])
//	 {
//		 this.relationshipsWithDestinationEntity[entityName]=this.properties.filter(function(property){ return property.getEntity().getName()===entityName; });
//	 }
//
//	 return this.relationshipsWithDestinationEntity[entityName];
// };

module.exports = ObjectGraphSchema;
