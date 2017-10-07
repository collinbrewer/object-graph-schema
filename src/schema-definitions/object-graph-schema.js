/**
* ObjectGraphSchema.js
* A library for describing, manipulating and querying entity schemas
*/

const EntitySchema = require('./entity-schema.js');

const index = (o, entityDefinitions) => {
	const entitiesByName = {};
	const entities = [];

	const index = {
		'entitiesByName': entitiesByName,
		'entities': entities
	};

	let entity;
	let entityDefinition;

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
