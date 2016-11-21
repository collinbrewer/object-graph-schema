/**
 * A subclass of Descriptor for Object Graph schemas
 */

import Descriptor from '@collinbrewer/descriptor';
import Predicate from '@collinbrewer/predicate';
import Expression from '@collinbrewer/expression';
import JSONPointer from 'json-pointer';

/**
 * ObjectGraphDescriptors follow the form:
 * {
 * 	entityName: 'Person',
 * 	predicate: '$SELF = $SELF',
 * 	valueExpression: 'name',
 * }
 */
var ObjectGraphDescriptor = Descriptor.extend();

// TODO: chaining
// queryDescriptor.find('Person').include(['firstName', 'lastName', 'age']).where('age < 21').orderBy('age').limit(1)

ObjectGraphDescriptor.prototype.getAffectingKeyPaths = function () {
	let affectingKeyPaths = [];
	let predicate = this.getPredicate();
	let valueExpression = this.getValueExpression();

	if (predicate) {
		affectingKeyPaths = affectingKeyPaths.concat(predicate.getDependentKeyPaths());
	}

	if (valueExpression) {
		affectingKeyPaths = affectingKeyPaths.concat(valueExpression.getDependentKeyPaths());
	}

	return affectingKeyPaths;
};

ObjectGraphDescriptor.prototype.getPredicate = function () {
	return this.predicate || (this.directives.predicate && (this.predicate = Predicate.parse(this.directives.predicate)));
};

ObjectGraphDescriptor.prototype.getValueExpression = function () {
	return this.valueExpression || (this.directives.valueExpression && (this.valueExpression = Expression.parse(this.directives.valueExpression)));
};

ObjectGraphDescriptor.register('object-graph', 'entityName', function (objectGraph, entityName) {
	return objectGraph[entityName];
});

ObjectGraphDescriptor.register('array', 'predicate', (arr, v) => {
	let predicate = Predicate.parse(v);
	let results = arr.filter((o) => { return predicate.evaluateWithObject(o); });

	return results;
});

ObjectGraphDescriptor.register('array', 'valueExpression', () => {
	let expression = Expression.parse(v);
	let results = arr.filter((o) => { return expression.getValueWithObject(o); });

	return results;
});

ObjectGraphDescriptor.register('array', 'valuePointer', (arr, v) => {
	let pointer = new JSONPointer(v);
	let results;

	try {
		results = pointer.evaluate(arr);
	}
	catch (e) {}

	return results;
});

function comparableValue (value) {
	var comparableValue = value;
	if (value instanceof Date) {
		comparableValue = value.getTime();
	}
	return comparableValue;
}

ObjectGraphDescriptor.register('array', 'order', function (arr, v) {
	console.log('ordering: ', arr, v);
	// lastName desc, firstName desc > []
	var args = v.split(',').map(function (desc) { var kvpa = desc.trim().split(' '); return {key: kvpa[0], order: (kvpa.length === 2 ? kvpa[1] : 'asc')}; });
	var key = args[0].key;
	var isDesc = (args[0].order === 'desc');

	console.log('key: ', key);
	console.log('isDesc: ', isDesc);

	arr = arr.sort(function (a, b) {
		var order = comparableValue(a[key]) > comparableValue(b[key]);

		if (!isDesc) {
			order = !order;
		}

		return order;
	});

	console.log('result', arr);

	return arr;
});

ObjectGraphDescriptor.register('array', 'limit', function (arr, v) {
	return arr.splice(0, v);
});

module.exports = Descriptor;

// Descriptor can't differentiate between objects on it's own, so directives
// won't be run in order.  We need to register a custom resolver in a specific order.
/**
 * We want {entityName:"Todo"} to turn {Todo:[todo1], Users:[user1]} into []
 */
// Synth.register(
//  "object-graph-filter",
//  function(descriptor){
//
//	  return function(doc){
//		  return Synth.generate("array-filter", doc[descriptor.entityName]);
//	  };
//  }
// );
// Synth.registerResolver("object-graph-filter", function(doc){
//
//	 return typeof(doc)==="object" && doc.
// });
