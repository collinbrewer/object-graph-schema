var Schema=require("./src/schema.js");

// export
(typeof(module)!=="undefined" ? (module.exports=Schema) : ((typeof(define)!=="undefined" && define.amd) ? define(function(){ return Schema; }) : (window.Schema=Schema)));
