Object Graph Schema
===================

[![Dependency Status](https://img.shields.io/david/collinbrewer/object-graph-schema/master.svg)](https://david-dm.org/collinbrewer/object-graph-schema.svg)

Object Graph Schema is a set of definitions for `Schema` for working with object graph and relational schema querying.

Usage
-----

### Definitions

#### Object Graph
```js
let objectGraphSchema = new ObjectGraphSchema({
	entities: [...]
});
```
#### Entity
```js
{
	schemaType: 'entity',
	name: 'Person',
	properties: [...]
}
```

#### Property

Basic property definitions are simple
```js
{
	schemaType: 'property',
	name: 'firstName',
	type: 'string'
}
```

Computed properties
```js
{
	type: 'computed',
	name: 'numberOfChildren'
	descriptor: {
		valueExpression: '@sum(children)'
	}
}
```

### Querying

#### Object Graph
```js
objectGraphSchema.getEntities();
objectGraphSchema.getEntity('Person');
```

#### Entities
```js
companySchema.getProperties();
companySchema.getProperty('employees');
```

#### Properties
```js
firstNameSchema.getType();
firstNameSchema.getAffectedProperties(); // [fullNameSchema]
firstNameSchema.getAffectingProperties(); // []
```

### Entity Associations
```js
personEntity.getAffectingEntities(); // [CompanySchema]
businessEntity.getAffectedEntities(); // [PersonSchema]
personEntity.isAffectedByEntity(businessEntity); // true
businessEntity.affectsEntity(personEntity); // true
```


### Property Associations
```js
fullNameProperty.getAffectingProperties(); // [firstName, lastName]
firstNameProperty.getAffectedProperties(); // [fullName]
fullNameProperty.affectedByProperty(firstNameProperty); // true
firstNameProperty.affectedByProperty(lastNameProperty); // false
```
