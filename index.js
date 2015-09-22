global.Schema=require("schema");
global.Expression=require("expression");
global.Predicate=require("predicate");
global.Descriptor=require("descriptor");

var ObjectGraph=require("./src/schema-definitions/index.js");

// expose
(function(mod, name){
   (typeof(module)!=="undefined" ? (module.exports=mod) : ((typeof(define)!=="undefined" && define.amd) ? define(function(){ return mod; }) : (window[name]=mod)));
})(ObjectGraph, "ObjectGraph");
