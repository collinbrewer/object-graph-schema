/**
 * Schema.js
 * A library for describing, manipulating and querying schemas
 */

(function(){

   var registeredByType={};

   function Schema(definition, inferred)
   {
      this.definition=definition;

      var schemaType=definition.schemaType || inferred;

      var SchemaClass=registeredByType[schemaType];

      return new SchemaClass(definition);
   }

   Schema.register=function(type, schemaClass){
      registeredByType[type]=schemaClass;
   };

   var infer=function(data){

      console.warn("Not yet implemented");

      var inferredType;

      if(typeof(data)==="object")
      {
         if(data.constructor===Array)
         {

         }
      }
   };

   Schema.infer=infer;

   // export
   (typeof(module)!=="undefined" ? (module.exports=Schema) : ((typeof(define)!=="undefined" && define.amd) ? define(function(){ return Schema; }) : (window.Schema=Schema)));
})();
