Object Graph Schema
===================

[![Dependency Status](https://img.shields.io/david/collinbrewer/object-graph-schema/master.svg)](https://david-dm.org/collinbrewer/object-graph-schema.svg)

Object Graph Schema is a set of definitions for `Schema` for working with object graph and relational schema querying.

Usage
-----

```js
import {ObjectGraphSchema} from 'object-graph-schema'

let schema=new ObjectGraphSchema(...);
```

### Entity Relationships
```js
personEntity.getAffectingEntities(); // [Business]
businessEntity.getAffectedEntities(); // [Person]
personEntity.isAffectedBy(businessEntity); // true
businessEntity.affects(personEntity); // true
```


### Property Relationships
```js
fullNameProperty.getAffectingProperties(); // [firstName, lastName]
firstNameProperty.getAffectedProperties(); // [fullName]
fullNameProperty.affectedByProperty(firstNameProperty); // true
firstNameProperty.affectedByProperty(lastNameProperty); // false
```
