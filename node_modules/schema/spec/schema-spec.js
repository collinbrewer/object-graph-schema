var should=require("chai").should();
var Schema=require("../index.js");

describe("Registration", function(){

   it("should register a new schema type", function(){

      var SchemaClass=function(definition){
         this.definition=definition;
      };
      SchemaClass.prototype.getValue=function(){ return this.definition.value; };

      Schema.register("custom-schema", SchemaClass);
   });

   it("should map from a schema definition", function(){

      var definition={
         "schemaType" : "custom-schema",
         "value" : "foo"
      };

      var schema=new Schema(definition);

      schema.getValue().should.equal("foo");
   });
});
