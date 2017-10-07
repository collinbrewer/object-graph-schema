/**
 * EntitySchema.js
 * A library for describing, manipulating and querying entity schemas
 */

var PropertySchema = require('./property-schema.js');

function _indexRelations () {
	// prepare a space for everything
	var i;
	var es;
	var l;
	var e;
	var m;

	for (i = 0, es = m.entities, l = es.length; i < l; i++) {
		e = es[i]
		m._entitiesByName[e.name] = e;

		e._propertiesByName = {};

		for (j = 0, ps = e.properties, c = ps.length, p; j < c, (p = ps[j]); j++) {
			e._propertiesByName[p.name] = p;

			p._dependentEntities = {};
			p._affectedEntities = {};
		}
	}

	var filterDuplicates = (el, i, a) => {
		return (i === a.indexOf(el));
	};

	// build the model graph
	for (i = es.length - 1, e; i >= 0, (e = es[i--]);) {
		e._includedProperties = [];
		e._relationshipPropertyNamesByEntityName = [];

		for (j = 0, ps = e.properties, c = ps.length, p; j < c, (p = ps[j]); j++) {
			// is included?
			(p.included || (p.type !== 'relationship' && p.type !== 'fetched' && (p.included === undefined || p.included === true))) && e._includedProperties.push(p);

			// get dependent properties, mostly for fetched properties - search the predicate, value expression, and properties
			if (p.type === 'fetched') {
				debug && console.log('%s.%s is fetched', e.name, p.name);

				p._dependentEntities[p.entityName || e.name] = [];

				if (p.predicate) {
					debug && console.log('	has predicate: ', p.predicate);

					// var dependentProperties=HRPredicate.getDependentKeyPaths(p.predicate);
					var predicate = HRPredicate.parse(p.predicate);
					var dependentPropertyExpressions = predicate.getDependentKeyPathExpressions();
					var dependentPropertyNames = dependentPropertyExpressions.map(HRManagedObjectModel._getFirstDependentKeyFromKeyPath);

					// p._dependentEntities[p.entityName || e.name]=dependentProperties;
					p._dependentEntities[p.entityName || e.name] = dependentPropertyNames;

					for (k = 0; k < dependentPropertyNames.length; k++) {
						debug && console.log('		%s.%s is dependent on %s.%s', e.name, p.name, p.entityName, dependentPropertyNames[k]);
						this._addAffectedProperty(p.entityName || e.name, dependentPropertyNames[k], e.name, p.name);
					}

					// p._dependentProperties=
				}

				if (p.valueExpression) {
					debug && console.log('	has value expression: ', p.valueExpression);

					var d = HRExpression.parse(p.valueExpression).getDependentKeyPaths();

					debug && console.log('		%s.%s is dependent on %s.%o', e.name, p.name, p.entityName, d);

					if (d) {
						// console.log(p.entityName || e.name);

						// console.log(p);

						for (k = 0; k < d.length; k++)
						{
							p._dependentEntities[p.entityName || e.name].push(d[k]);

							this._addAffectedProperty(p.entityName || e.name, d[k], e.name, p.name);
						}
					}
				}

				// NOTE: I think this removes duplicates
				p._dependentEntities[p.entityName || e.name] = p._dependentEntities[p.entityName || e.name].filter(filterDuplicates);
			}
		}
	}
};

var indexRelations = (o, propertyDefinitions) => {
	var index = {

	};

	var propertyDefinition;
	var name;
	var p;
	var j;
	var c;
	var ps;

	for (j = 0, ps = propertyDefinitions, c = ps.length, p; j < c; j++) {
		p = ps[j];
		propertyDefinition = propertyDefinitions[j];
		name = propertyDefinition.name;

		index[name] = {
			affectedBy: {},
			affecting: {}
		};

		// if()
	}
};

var index = (o, propertyDefinitions) => {
	propertyDefinitions || (propertyDefinitions = []);

	var attributes = {};
	var relationships = {};
	var fetched = {};
	// var included = {};
	var required = {};
	var transient = {};
	const propertiesByName = {};
	var properties = [];

	var index = {
		'attribute': attributes,
		'relationship': relationships,
		'fetched': fetched,
		'required': required,
		'transient': transient,
		propertiesByName
	};

	var property;
	var type;
	var name;

	for (var i = 0, l = propertyDefinitions.length; i < l; i++) {
		property = new PropertySchema(propertyDefinitions[i], o);
		properties.push(property);
		type = property.getType();
		name = property.getName();

		// index by type and name
		index[type][name] = property;

		// required
		if (property.isRequired()) {
			required[name] = property;
		}

		// transient
		if (property.isTransient()) {
			transient[name] = property;
		}

		// all
		propertiesByName[name] = property;
	}

	// console.log("index: ", index);

	o.index = index;
	o.properties = properties;
};

/**
 * EntitySchema
 */
class EntitySchema {
	constructor (definition, objectGraph) {
		this.definition = definition;
		this.objectGraph = objectGraph;

		// NOTE: this was meant to be done on the fly for the sake of memory, but for now, it's done upfront
		index(this, this.definition.properties);
	}

	/**
	 * Returns the raw mapping of relationships
	 */
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
	 * Returns the object graph the receiver belongs to.
	 */
	getObjectGraph () {
		return this.objectGraph;
	}

	/**
	 * Returns the name of the entity.
	 */
	getName () {
		return this.definition.name;
	}

	/**
	 * Used to get the class name of the entity.
	 */
	getClassName () {
		return this.definition.className || this.definition.name;
	}

	/**
	 * Used to get the class of the entity.
	 */
	getClass () {
		return this.definition.class;
	}

	/**
	 * Used to get the entities attributes by name.
	 */
	getAttributesByName () {
		return this.index.attribute;
	}

	/**
	 * Used to get the entities relationships by name.
	 */
	getRelationshipsByName () {
		return this.index.relationship;
	}

	/**
	 * Used to get the entities fetched properties by name.
	 */
	getFetchedByName () {
		return this.index.fetched;
	}

	/**
	 * Used to get the entities required properties by name.
	 */
	getRequiredByName () {
		return this.index.required;
	}

	/**
	 * Used to get the entities transient properties by name.
	 */
	getTransientByName () {
		return this.index.transient;
	}

	/**
	 * Used to get the entities properties by name.
	 */
	getPropertiesByName () {
		return this.index.propertiesByName;
	}

	/**
	 * Used to get a property of the entity by name.
	 */
	getPropertyWithName (name) {
		return this.index.propertiesByName[name];
	}

	/**
	 * Used to get a list of the entities properties.
	 * @return {array} The properties of the entity
	 */
	getProperties () {
		return this.properties;
	}

	// If a property's value is dependent on other information, like a fetched property, need to be able to invalidate a property
	// for example, fullName is not a persistent value, instead it is derived from two other properties, firstName and lastName, the dependent properties
	// if lastName is computed as "John Smith", then firstName is changed to "Mike", then not only has firstName changed, but so has fullName...
	// when we ask for fullName again, the result will be "Mike Smith"

	// So requests to observe a change to a derived property, are actually rerouted to changes on the derived property's dependent properties...
	// in other words, when observing changes to fullName, KVO is relaying changes to firstName or lastName

	// Data is a special case because of it's built in caching, for example, if coredata requests a property called fullName, it will derive it's value from
	// it's dependent properties, firstName and lastName, and will then cache that value, making it no longer a realtime representation of values derived from it's
	// dependent properties(firstName and lastName).  So, if a change is made to firstName, KVO will fire a willChange/didChange for fullName if there is a
	// registered observer, however the cached value will still be the same... so...

	// In this special case we'll need to invalidate the cached value but there are a few complications:
	//  - in the standard case, the information will inherently be correct after the didChange notification, here that will not be the case
	//  - invalidating the cache, may fragment the necessary information to resolve the value of the affected key, requiring an additional call to the store
	//  - unlike the standard case, the cache will need to be invalidated, even if there is not an observer for the affected property

	// managed objects will have to handle the special case by observing changes to the context, when a change occurs on the context

	// we query the model in a bunch of different ways, this method will be used to prepare it all ahead of time
	//	 _entitiesByName: all entities in a dictionary instead of an array
	//	 _includedProperties: all properties who are explicitly included or are attributes
	//	 _dependentEntities: a dictionary of all entities & properties that a property depends on
	//	 _affectedEntities: a dictionary of all entities & that are affected by the change of the property

	// e1.p1 affects e2.p2
	_addAffectedProperty (e1, p1, e2, p2) {
		var m = this.model;

		if (!m._entitiesByName[e1]._propertiesByName[p1]._affectedEntities[e2]) {
			m._entitiesByName[e1]._propertiesByName[p1]._affectedEntities[e2] = [];
		}

		m._entitiesByName[e1]._propertiesByName[p1]._affectedEntities[e2].push(p2); // my property is affected by you're property
	}

	getPropertiesAffecting (affectedProperty) {
		return this.getProperties().filter(function (property) {
			return property.affects(affectedProperty);
		});
	}

	getPropertiesAffectedBy (affectingProperty) {
		return this.getProperties().filter(function (property) {
			return property.isAffectedBy(affectingProperty); // is dependent on
		});
	}
}

module.exports = EntitySchema;
