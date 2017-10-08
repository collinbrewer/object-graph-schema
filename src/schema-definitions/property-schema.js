/**
 * PropertySchema.js
 * A library for describing, manipulating and querying property schemas
 */
var Predicate = require('@collinbrewer/predicate');

var TypeValidators = {
	'string': function (value) { return typeof (value) === 'string'; },
	'number': function (value) { return typeof (value) === 'number' && !isNaN(value); },
	'boolean': function (value) { return typeof (value) === 'boolean'; },
	'date': function (value) { return typeof (value) === 'object' && !!value && value.varructor.name === 'Date'; }
};

var Typecasters = {
	'string': function (value) { return '' + value; },
	'number': function (value) { return +value; },
	'boolean': function (value) { return !!value; },
	'date': function (value) { return Date.parse(value); }
};

// TODO: we should rely on our custom expression for getting this value
var getFirstDependentKeyFromKeyPath = (keyPath) => {
	var keyPathComponents = keyPath.split('.');
	var keyPathComponent;
	var dependentKey = null;

	while ((keyPathComponent = keyPathComponents.shift())) {
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
var index = (o, propertyDefinition) => {
	var { valueExpression, predicate, entityName = 'SELF' } = propertyDefinition;
	var affectedBy = {};
	var index = { affectedBy };
	var affectedByEntity;

	if (entityName) {
		affectedByEntity = (affectedBy[entityName] = {});
	}

	if (valueExpression) {
		var dependentKey = getFirstDependentKeyFromKeyPath(valueExpression);

		affectedByEntity[dependentKey] = true;
	}

	// process the predicate
	if (predicate) {
		var pred = Predicate.parse(predicate);
		var keyPathExpressions = pred.getDependentKeyPathExpressions();

		keyPathExpressions.forEach(keyPathExpression => (
			affectedByEntity[keyPathExpression.getKeyPath()] = true
		));
	}

	o.index = index;
};

/**
 * PropertyDescription
 */
class PropertySchema {
	constructor (definition, entity) {
		this.definition = definition;
		this.entity = entity;

		index(this, definition);
	}

	getIndex () {
		return this.index;
	}

	/**
	 * Returns the definition used to create the schema.
	 */
	getDefinition () {
		return this.definition;
	}

	/**
	 * Returns the parent entity the property belongs to.
	 */
	getEntity () {
		return this.entity;
	}

	/**
	 * Returns the name of the property
	 */
	getName () {
		return this.definition.name;
	}

	/**
	 * Returns the type of the property
	 */
	getType () {
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
	getAttributeType () {
		return (this.getType() === 'attribute' ? this.definition.type : undefined);
	}

	/**
	 * Used to determine if the property is required.
	 */
	isRequired () {
		var definition = this.definition;
		return ('required' in definition) && definition.required === true;
	}

	/**
	 * Used to determine if the property is transient.
	 */
	isTransient () {
		var type = this.getType();
		return (type === 'fetched' || type === 'transient');
	}

	/**
	 * Returns true if the property is a to many relationship
	 * @return {Boolean} Relationship is a to many relationship
	 */
	isToMany () {
		var definition = this.definition;
		return (('toMany' in definition) ? definition.toMany : false);
	}

	/**
	 * Returns the destination entity for a relationship.
	 */
	getDestinationEntity () {
		var definition = this.definition;
		var entity = this.getEntity();
		var objectGraph = entity.getObjectGraph();

		return objectGraph.getEntitiesByName()[definition.entityName];
	}

	/**
	 * Returns the devare rule for a relationship property.
	 * @return {string} The devare rule for the property
	 */
	getDevareRule () {
		return this.definition.devareRule || null;
	}

	/**
	 * Returns the destination entity name for a relationship property
	 * @return {String} The destination entity of the relationship.
	 */
	getEntityName () {
		return this.definition.entityName;
	}

	/**
	 * Returns the permissions for the property.
	 */
	getPermission () {
		return (this.definition.permission || 'readwrite');
	}

	/**
	 * Returns the name of the instance variable used to store the property.
	 * @return {string} The name of the instance variable.
	 */
	getIvar () {
		var definition = this.definition;

		return (('ivar' in definition) ? definition.ivar : definition.name);
	}

	/**
	 * Returns the name of the setter method for the property
	 */
	getSetterName () {
		var definition = this.definition;
		var setterName;

		if (!definition.permission || (definition.permission && definition.permission === 'readwrite')) {
			setterName = definition.setter;

			if (!setterName) {
				var name = definition.name;
				var Name = (name.substr(0, 1).toUpperCase() + name.substr(1));

				setterName = ('set' + Name);
			}
		}

		return setterName;
	}

	/**
	 * Returns the name of the getter method for the property
	 */
	getGetterName () {
		var definition = this.definition;
		var getterName;

		getterName = definition.getter;

		if (!getterName) {
			var name = definition.name;
			var Name = (name.substr(0, 1).toUpperCase() + name.substr(1));

			getterName = ('get' + Name);
		}

		return getterName;
	}

	/**
	 * Returns the name of the checker method for the property
	 */
	getCheckerName () {
		var definition = this.definition;
		var checkerName;

		checkerName = definition.checker;

		if (!checkerName) {
			var name = definition.name;
			var Name = (name.substr(0, 1).toUpperCase() + name.substr(1));

			checkerName = ('has' + Name);
		}

		return checkerName;
	}

	/**
	 * Returns the name of the fetcher method for the property
	 */
	getFetcherName () {
		var definition = this.definition;
		var fetcherName;

		fetcherName = definition.fetcher;

		if (!fetcherName) {
			var name = definition.name;
			var Name = (name.substr(0, 1).toUpperCase() + name.substr(1));

			fetcherName = ('fetch' + Name);
		}

		return fetcherName;
	}

	/**
	 * Returns a list of property definitions whose values are dependent on the value of the receiver
	 */
	getAffectedProperties (affectingProperty) {
		return this.getProperties().filter(function (property) {
			return property.isAffectedBy(affectingProperty); // is dependent on
		});
	}
}

module.exports = PropertySchema;
