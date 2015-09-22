var ObjectGraph=require("./src/schema-definitions/index.js");

// expose
(function(mod, name){
   (typeof(module)!=="undefined" ? (module.exports=mod) : ((typeof(define)!=="undefined" && define.amd) ? define(function(){ return mod; }) : (window[name]=mod)));
})(ObjectGraph, "ObjectGraph");
