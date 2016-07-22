/**
 * Registers ObjectGraph's schema types with Schema.
 */

// dependencies
var Schema=require("schema");
var PropertySchema=require("./src/property-schema.js");
var EntitySchema=require("./src/entity-schema.js");
var ObjectGraphSchema=require("./src/object-graph-schema.js");

// register defaults
Schema.register("property", PropertySchema);
Schema.register("entity", EntitySchema);
Schema.register("object-graph", ObjectGraphSchema);

module.exports=Schema;
