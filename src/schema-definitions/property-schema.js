/**
 * PropertySchema.js
 * A library for describing, manipulating and querying property schemas
 */

import ObjectGraphDescriptor from '../descriptor-handlers/index.js';

var descriptorAsString = (d) => { return d.directives.entityName + (d.directives.valueExpression ? '.' + d.directives.valueExpression : ''); };

// var TypeValidators = {
// 	'string': function (value) { return typeof (value) === 'string'; },
// 	'number': function (value) { return typeof (value) === 'number' && !isNaN(value); },
// 	'boolean': function (value) { return typeof (value) === 'boolean'; },
// 	'date': function (value) { return typeof (value) === 'object' && !!value && value.constructor.name === 'Date'; }
// };

// var Typecasters = {
// 	'string': function (value) { return '' + value; },
// 	'number': function (value) { return +value; },
// 	'boolean': function (value) { return !!value; },
// 	'date': function (value) { return Date.parse(value); }
// };

// TODO: we should rely on our custom expression for getting this value
const getFirstDependentKeyFromKeyPath = (keyPath) => {
	const keyPathComponents = keyPath.split('.');
	let keyPathComponent;
	let dependentKey = null;

	while ((keyPathComponent = keyPathComponents.shift())) {
		if (keyPathComponent.charAt(0) !== '@') {
			dependentKey = keyPathComponent;
			break;
		}
	}

	return dependentKey;
};

const index = (o, propertyDefinition) => {
	const affectedBy = {};

	// var index = {
	// 	'affectedBy': affectedBy
	// };

	const type = propertyDefinition.type;

	// cases:
	// fullName = firstName + lastName
	// children = All Person objects whose "parent" is SOURCE
	if (type === 'fetched' || ('valueExpression' in propertyDefinition)) {
		// process the expression
		if (('valueExpression' in propertyDefinition)) {
			const dependentKey = getFirstDependentKeyFromKeyPath(propertyDefinition.valueExpression);

			affectedBy[dependentKey];
		}

		// process the predicate
		if (('predicate' in propertyDefinition)) {
			// Predicate.getProperties()
		}
	}
};

/**
 * PropertyDescription
 */
class PropertySchema {
	constructor (definition, entity) {
		this.definition = definition;
		this.entity = entity;
		this.associations = {};

		index(this, definition);
	}

	/**
	 * Returns the definition used to create the schema.
	 */
	getDefinition () {
		return this.definition;
	}

	/**
	 * Returns the object graph property belongs to.
	 */
	getObjectGraph () {
		return (this.entity ? this.entity.getObjectGraph() : undefined);
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
		let type = this.definition.type;

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
		const definition = this.definition;
		return ('required' in definition) && definition.required === true;
	}

	/**
	 * Used to determine if the property is transient.
	 */
	isTransient () {
		const type = this.getType();
		return (type === 'fetched' || type === 'transient');
	}

	/**
	 * Returns true if the property is a to many relationship
	 * @return {Boolean} Relationship is a to many relationship
	 */
	isToMany () {
		const definition = this.definition;
		return (('toMany' in definition) ? definition.toMany : false);
	}

	/**
	 * Returns the destination entity for a relationship.
	 */
	getDestinationEntity () {
		let destinationEntity;
		const objectGraph = this.getObjectGraph();
		let descriptor;
		let affectingKeyPaths;

		if (objectGraph) {
			descriptor = this.getDescriptor();
			affectingKeyPaths = descriptor.getAffectingKeyPaths();

			destinationEntity = objectGraph.getEntity(this.getEntity);
		}

		return destinationEntity;
	}

	/**
	 * Returns the delete rule for a relationship property.
	 * @return {string} The delete rule for the property
	 */
	getDeleteRule () {
		return this.definition.deleteRule || null;
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
		const definition = this.definition;

		return (('ivar' in definition) ? definition.ivar : definition.name);
	}

	/**
	 * Returns the name of the setter method for the property
	 */
	getSetterName () {
		let setterName;
		const definition = this.definition;

		if (!definition.permission || (definition.permission && definition.permission === 'readwrite')) {
			setterName = definition.setter;

			if (!setterName) {
				const name = definition.name;
				const Name = (name.substr(0, 1).toUpperCase() + name.substr(1));

				setterName = (`set${Name}`);
			}
		}

		return setterName;
	}

	/**
	 * Returns the name of the getter method for the property
	 */
	getGetterName () {
		let getterName;
		const definition = this.definition;

		getterName = definition.getter;

		if (!getterName) {
			const name = definition.name;
			const Name = (name.substr(0, 1).toUpperCase() + name.substr(1));

			getterName = (`get${Name}`);
		}

		return getterName;
	}

	/**
	 * Returns the name of the checker method for the property
	 */
	getCheckerName () {
		let checkerName;
		const definition = this.definition;

		checkerName = definition.checker;

		if (!checkerName) {
			const name = definition.name;
			const Name = (name.substr(0, 1).toUpperCase() + name.substr(1));

			checkerName = (`has${Name}`);
		}

		return checkerName;
	}

	/**
	 * Returns the name of the fetcher method for the property
	 */
	getFetcherName () {
		let fetcherName;
		const definition = this.definition;

		fetcherName = definition.fetcher;

		if (!fetcherName) {
			const name = definition.name;
			const Name = (name.substr(0, 1).toUpperCase() + name.substr(1));

			fetcherName = (`fetch${Name}`);
		}

		return fetcherName;
	}

	/**
	 * Returns a descriptor for the property
	 * The descriptor is the source of truth for properties, it is the resolved counterpart of the
	 * property definition.  The property definition is parsed into
	 * a property object, which is then interpreted into a descriptor
	 * A person's fullName will have affectingDescriptors [firstName, lastName]
	 */
	getDescriptor () {
		if (!this.descriptor) {
			const {definition} = this;
			let {entityName, valueExpression, predicate} = definition;

			// resolve entity name
			// if (!entityName && valueExpression) { // resolve using value expression
			//
			// }

			if (!entityName) { // still nothing? just fall back to self
				entityName = this.getEntity().getName();
			}

			// resolve a value expression
			if (!valueExpression) {
				valueExpression = definition.name;
			}

			this.descriptor = new ObjectGraphDescriptor({
				entityName,
				valueExpression,
				predicate
			});
		}

		return this.descriptor;
	}

	/**
	 * Returns a list of properties whose values are dependent on the value of the receiver
	 */
	isAffectedByProperty (affectingProperty) {
		// console.log('affecting properties', this.getAffectingProperties().map(p => p.getName()));
		return (this.getAffectingProperties().indexOf(affectingProperty) !== -1);
	}

	/**
	 * Returns true if the given property is dependent on the receiver
	 */
	affectsProperty (affectedProperty) {
		return affectedProperty.isAffectedByProperty(this);
	}

	/**
	 * Returns a list of properties whose values are dependent on the value of the receiver
	 */
	getAffectedProperties () {
		return this.getObjectGraph().getProperties().filter((property) => {
			return property.isAffectedByProperty(this);
		});
	}

	getAffectingDescriptors () {
		const descriptor = this.getDescriptor();
		const affectingKeyPaths = descriptor.getAffectingKeyPaths();
		const entity = this.getEntity();

		return affectingKeyPaths.map((affectingKeyPath) => {
			const affectingDescriptor = entity.getProperty(affectingKeyPath).getDescriptor();
			return affectingDescriptor;
		});
	}

	/**
	 * Returns a list of properties whose values are dependent on the value of the receiver
	 */
	getAffectingProperties () {
		let affectingProperties = this.associations.affectingProperties;

		if (!affectingProperties) {
			console.log('getAffectingProperties', this.getEntity().getName() + '.' + this.getName());
			// descriptorAsString(this.getDescriptor())
			// const affectingDescriptors = this.getAffectingDescriptors();
			// const objectGraph = this.getObjectGraph();

			// console.log('affectingDescriptors', affectingDescriptors);

			// initialize and cache for next time
			affectingProperties = (this.associations.affectingProperties = []);

			let affectingKeyPath = this.getDescriptor().directives.valueExpression;

			let keyPathComponents = affectingKeyPath.split('.');
			let nextProperty = this;
			let objectGraph = this.getObjectGraph();

			keyPathComponents.forEach((nextKey) => {
				let descriptor = nextProperty.getDescriptor();
				let nextEntity = nextProperty.getDestinationEntity();

				console.log('            current entity is', nextEntity.getName());
				console.log('            working on next key "%s"', nextKey);
				nextProperty = nextEntity.getProperty(nextKey);
				console.log('               got next property', nextProperty.getName());
			});

			return affectingProperties;

			// console.log('   working on affecting descriptors');
			//
			// // from the descriptor, we need to resolve the link to the associated entity/property
			// // Person.employerName -> Person.(employer.name) -> Person.((Company).name)
			// affectingDescriptors.forEach((affectingDescriptor) => {
			// 	console.log('      affectingDescriptor', descriptorAsString(affectingDescriptor));
			// 	return affectingDescriptor.getAffectingKeyPaths().forEach((affectingKeyPath) => {
			// 		console.log('         descriptor is affected by keypath', affectingKeyPath);
			// 		console.log('         resolving property for', affectingKeyPath);
			//
			// 		// walk each key in the key path until we find the final property
			// 		// we started with Person.employer, which has a key path of `employer.name`
			// 		// we need to resolve the `employer` property name, by looking for it on the current
			// 		// entity (Person), we should end up with the property for `employer`
			// 		let keyPathComponents = affectingKeyPath.split('.');
			// 		let nextProperty = this;
			//
			// 		keyPathComponents.forEach((nextKey) => {
			// 			console.log('            working on next key "%s"', nextKey);
			// 			nextProperty = nextProperty.getEntity().getProperty(nextKey);
			// 			console.log('               got next property', nextProperty.getName());
			// 		});
			//
			// 		// we need to determine that employer is an alias for Company
			// 		// let affectingEntity = objectGraph.getEntity(affectingDescriptor.directives.entityName);
			// 		//
			// 		// // get the property for the affecting key path... affectingKeyPath
			// 		// let affectingProperty = affectingEntity.getProperty(affectingDescriptor.directives);
			// 		//
			// 		// console.log('            affecting entity', affectingEntity.getName());
			// 		// console.log('            affecting name', affectingProperty.getName());
			// 		// console.log('            descriptor', affectingProperty.getDescriptor());
			// 		affectingProperties.push(nextProperty);
			// 	});
			// });

			// console.log('affectingProperties', affectingProperties);
		}

		return affectingProperties || [];
	}
}

module.exports = PropertySchema;
