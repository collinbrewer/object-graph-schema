var should=require("chai").should();

var ObjectGraphSchema=require("../index.js");

describe("Root", function(){

   it("should create a new root schema", function(){

      var definition={
         "schemaType" : "object-graph",
         "entities" : [
            {
               "schemaType" : "entity",
               "name" : "Todo",
               "properties" : [
                  {
                     "schemaType" : "property",
                     "name" : "title",
                     "type" : "string"

                  }
               ]
            }
         ]
      };

      var schema=new ObjectGraphSchema(definition);

      should.exist(schema);
   });
});
