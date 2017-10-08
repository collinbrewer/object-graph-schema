'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * PropertySchema.js
 * A library for describing, manipulating and querying property schemas
 */
var Predicate = require('@collinbrewer/predicate');

var TypeValidators = {
	'string': function string(value) {
		return typeof value === 'string';
	},
	'number': function number(value) {
		return typeof value === 'number' && !isNaN(value);
	},
	'boolean': function boolean(value) {
		return typeof value === 'boolean';
	},
	'date': function date(value) {
		return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !!value && value.varructor.name === 'Date';
	}
};

var Typecasters = {
	'string': function string(value) {
		return '' + value;
	},
	'number': function number(value) {
		return +value;
	},
	'boolean': function boolean(value) {
		return !!value;
	},
	'date': function date(value) {
		return Date.parse(value);
	}
};

// TODO: we should rely on our custom expression for getting this value
var getFirstDependentKeyFromKeyPath = function getFirstDependentKeyFromKeyPath(keyPath) {
	var keyPathComponents = keyPath.split('.');
	var keyPathComponent;
	var dependentKey = null;

	while (keyPathComponent = keyPathComponents.shift()) {
		if (keyPathComponent.charAt(0) !== '@') {
			dependentKey = keyPathComponent;
			break;
		}
	}

	return dependentKey;
};

/**
 * builds an index of the relationships between entities and properties
 * propertyName: { affectedBy: { entityName: { propertyName: true } } }
 */
var index = function index(o, propertyDefinition) {
	var valueExpression = propertyDefinition.valueExpression,
	    predicate = propertyDefinition.predicate,
	    _propertyDefinition$e = propertyDefinition.entityName,
	    entityName = _propertyDefinition$e === undefined ? 'SELF' : _propertyDefinition$e;

	var affectedBy = {};
	var index = { affectedBy: affectedBy };
	var affectedByEntity;

	if (entityName) {
		affectedByEntity = affectedBy[entityName] = {};
	}

	if (valueExpression) {
		var dependentKey = getFirstDependentKeyFromKeyPath(valueExpression);

		affectedByEntity[dependentKey] = true;
	}

	// process the predicate
	if (predicate) {
		var pred = Predicate.parse(predicate);
		var keyPathExpressions = pred.getDependentKeyPathExpressions();

		keyPathExpressions.forEach(function (keyPathExpression) {
			return affectedByEntity[keyPathExpression.getKeyPath()] = true;
		});
	}

	o.index = index;
};

/**
 * PropertyDescription
 */

var PropertySchema = function () {
	function PropertySchema(definition, entity) {
		_classCallCheck(this, PropertySchema);

		this.definition = definition;
		this.entity = entity;

		index(this, definition);
	}

	_createClass(PropertySchema, [{
		key: 'getIndex',
		value: function getIndex() {
			return this.index;
		}

		/**
   * Returns the definition used to create the schema.
   */

	}, {
		key: 'getDefinition',
		value: function getDefinition() {
			return this.definition;
		}

		/**
   * Returns the parent entity the property belongs to.
   */

	}, {
		key: 'getEntity',
		value: function getEntity() {
			return this.entity;
		}

		/**
   * Returns the name of the property
   */

	}, {
		key: 'getName',
		value: function getName() {
			return this.definition.name;
		}

		/**
   * Returns the type of the property
   */

	}, {
		key: 'getType',
		value: function getType() {
			var type = this.definition.type;

			// if it's not a relationship or fetched property, it's an attribute
			// NOTE: Probably need to separate this out into different classes
			type !== 'relationship' && type !== 'fetched' && (type = 'attribute');

			return type;
		}

		/**
   * Used to retreive the type of an attribute property.
   * @return {string} An attribute type.  string|number|boolean|date
   */

	}, {
		key: 'getAttributeType',
		value: function getAttributeType() {
			return this.getType() === 'attribute' ? this.definition.type : undefined;
		}

		/**
   * Used to determine if the property is required.
   */

	}, {
		key: 'isRequired',
		value: function isRequired() {
			var definition = this.definition;
			return 'required' in definition && definition.required === true;
		}

		/**
   * Used to determine if the property is transient.
   */

	}, {
		key: 'isTransient',
		value: function isTransient() {
			var type = this.getType();
			return type === 'fetched' || type === 'transient';
		}

		/**
   * Returns true if the property is a to many relationship
   * @return {Boolean} Relationship is a to many relationship
   */

	}, {
		key: 'isToMany',
		value: function isToMany() {
			var definition = this.definition;
			return 'toMany' in definition ? definition.toMany : false;
		}

		/**
   * Returns the destination entity for a relationship.
   */

	}, {
		key: 'getDestinationEntity',
		value: function getDestinationEntity() {
			var definition = this.definition;
			var entity = this.getEntity();
			var objectGraph = entity.getObjectGraph();

			return objectGraph.getEntitiesByName()[definition.entityName];
		}

		/**
   * Returns the devare rule for a relationship property.
   * @return {string} The devare rule for the property
   */

	}, {
		key: 'getDevareRule',
		value: function getDevareRule() {
			return this.definition.devareRule || null;
		}

		/**
   * Returns the destination entity name for a relationship property
   * @return {String} The destination entity of the relationship.
   */

	}, {
		key: 'getEntityName',
		value: function getEntityName() {
			return this.definition.entityName;
		}

		/**
   * Returns the permissions for the property.
   */

	}, {
		key: 'getPermission',
		value: function getPermission() {
			return this.definition.permission || 'readwrite';
		}

		/**
   * Returns the name of the instance variable used to store the property.
   * @return {string} The name of the instance variable.
   */

	}, {
		key: 'getIvar',
		value: function getIvar() {
			var definition = this.definition;

			return 'ivar' in definition ? definition.ivar : definition.name;
		}

		/**
   * Returns the name of the setter method for the property
   */

	}, {
		key: 'getSetterName',
		value: function getSetterName() {
			var definition = this.definition;
			var setterName;

			if (!definition.permission || definition.permission && definition.permission === 'readwrite') {
				setterName = definition.setter;

				if (!setterName) {
					var name = definition.name;
					var Name = name.substr(0, 1).toUpperCase() + name.substr(1);

					setterName = 'set' + Name;
				}
			}

			return setterName;
		}

		/**
   * Returns the name of the getter method for the property
   */

	}, {
		key: 'getGetterName',
		value: function getGetterName() {
			var definition = this.definition;
			var getterName;

			getterName = definition.getter;

			if (!getterName) {
				var name = definition.name;
				var Name = name.substr(0, 1).toUpperCase() + name.substr(1);

				getterName = 'get' + Name;
			}

			return getterName;
		}

		/**
   * Returns the name of the checker method for the property
   */

	}, {
		key: 'getCheckerName',
		value: function getCheckerName() {
			var definition = this.definition;
			var checkerName;

			checkerName = definition.checker;

			if (!checkerName) {
				var name = definition.name;
				var Name = name.substr(0, 1).toUpperCase() + name.substr(1);

				checkerName = 'has' + Name;
			}

			return checkerName;
		}

		/**
   * Returns the name of the fetcher method for the property
   */

	}, {
		key: 'getFetcherName',
		value: function getFetcherName() {
			var definition = this.definition;
			var fetcherName;

			fetcherName = definition.fetcher;

			if (!fetcherName) {
				var name = definition.name;
				var Name = name.substr(0, 1).toUpperCase() + name.substr(1);

				fetcherName = 'fetch' + Name;
			}

			return fetcherName;
		}

		/**
   * Returns a list of property definitions whose values are dependent on the value of the receiver
   */

	}, {
		key: 'getAffectedProperties',
		value: function getAffectedProperties(affectingProperty) {
			return this.getProperties().filter(function (property) {
				return property.isAffectedBy(affectingProperty); // is dependent on
			});
		}
	}]);

	return PropertySchema;
}();

module.exports = PropertySchema;