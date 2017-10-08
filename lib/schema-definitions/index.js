'use strict';

/**
 * Registers ObjectGraph's schema types with Schema.
 */

// dependencies
var Schema = require('schema');
var PropertySchema = require('./property-schema.js');
var EntitySchema = require('./entity-schema.js');
var ObjectGraphSchema = require('./object-graph-schema.js');

// register defaults
Schema.register('property', PropertySchema);
Schema.register('entity', EntitySchema);
Schema.register('object-graph', ObjectGraphSchema);

module.exports = Schema;