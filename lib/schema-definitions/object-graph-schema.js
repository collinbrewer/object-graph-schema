'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* ObjectGraphSchema.js
* A library for describing, manipulating and querying entity schemas
*/

var EntitySchema = require('./entity-schema.js');

var index = function index(o, entityDefinitions) {
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

var ObjectGraphSchema = function () {
	function ObjectGraphSchema(definition) {
		_classCallCheck(this, ObjectGraphSchema);

		this.definition = definition;

		index(this, definition.entities);
	}

	_createClass(ObjectGraphSchema, [{
		key: 'getIndex',
		value: function getIndex() {
			return this.index;
		}
	}, {
		key: 'getName',
		value: function getName() {
			return this.definition.name;
		}
	}, {
		key: 'getEntities',
		value: function getEntities() {
			return this.index.entities;
		}
	}, {
		key: 'getEntitiesByName',
		value: function getEntitiesByName() {
			return this.index.entitiesByName;
		}
	}]);

	return ObjectGraphSchema;
}();

module.exports = ObjectGraphSchema;