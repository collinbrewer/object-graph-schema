/**
* ObjectGraphSchema.js
* A library for describing, manipulating and querying entity schemas
*/

var EntitySchema = require('./entity-schema.js');

var index = function (o, entityDefinitions) {
	var entitiesByName = {};
	var entities = [];

	var index = {
		'entitiesByName': entitiesByName,
		'entities': entities
	};

	var entity;
	var entityDefinition;

	for (var i = 0, l = entityDefinitions.length; i < l; i++) {
		entityDefinition = entityDefinitions[i];
		entity = new EntitySchema(entityDefinition, o);

		// index by type and name
		entitiesByName[entityDefinition.name] = entity;

		entities.push(entity);
	}

	o.index = index;
};

/**
 * ObjectGraphSchema
 */
class ObjectGraphSchema {
	constructor (definition) {
		this.definition = definition;

		index(this, definition.entities);
	}

	getIndex () {
		return this.index;
	}

	getName () {
		return this.definition.name;
	}

	getEntities () {
		return this.index.entities;
	}

	getEntitiesByName () {
		return this.index.entitiesByName;
	}
}

module.exports = ObjectGraphSchema;
