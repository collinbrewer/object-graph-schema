# Schema
Schema defines a protocol for using json objects to define arbitrary schemas and a utility for parsing and understanding schemas.

It's used by Synth to understand and build the object graph.

## Protocol Concept
The protocol for defining schemas is quite simple, and offers a lot of flexibility for various data formats.  It uses a nested approach where a ```type``` property defines how the schema is treated.

The predefined schema types are:
- **collection**: A schema defining a list of entities
- **entity**: A schema defining the format of an object
- **property**: A schema defining a single field of an object

The following data:

```javascript
var data={
   "Todo" : [
      {
         id: 1234,
         title: "Hello World"
      }
   ],
   "User" : [
      {
         id: 4321,
         name: "Chris Ericson"
      }
   ]
};
```

Can be defined explicitly in Schema as:

```javascript
var schema={
   "schemaType": "store",
   "entities" : [
      {
         "schemaType" : "entity",
         "name" : "Todo",
         "properties": [
            {
               "schemaType" : "property",
               "name" : "id",
               "type" : "number"
            },
            {
               "schemaType" : "property",
               "name" : "title",
               "type" : "string"
            }
         ]
      },
      {
         "schemaType" : "entity",
         "name" : "User",
         "properties" : [
            {
               "schemaType" : "property",
               "name" : "id",
               "type" : "number"
            },
            {
               "schemaType" : "property",
               "name" : "name",
               "type" : "string"
            }
         ]
      }
   ]
}
```

...Or represented in the basic string format:
```javascript
var schema="{Todo:[{id:0,title:''}]}";
```

For simplicity, you can skip using schemaTypes and Schema will assume a more traditional format of store->collections->properties, or database->tables->fields... or natively, an object of lists of objects

## Usage
```javascript
var json={
   "type" : "store",
   "Todo" : {
      "type": "entity",
      "schema" : {

      }
   }
};

var schema=new Schema(json);

var entitiesSchema=schema.get("entities");

var entitySchema=entitiesSchema.get("Todo");

var propertiesSchema=entitySchema.get("properties");

var propertySchema=propertySchema("title");
```
