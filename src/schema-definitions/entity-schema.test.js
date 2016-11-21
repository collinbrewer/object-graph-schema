import {expect} from 'chai';
import EntitySchema from './entity-schema.js';

describe('EntitySchema', () => {
	var definition = {
		'schemaType': 'entity',
		'name': 'Person',
		'className': 'PersonObject',
		'properties': [
			{
				'schemaType': 'property',
				'name': 'firstName',
				'type': 'string',
				'required': true
			},
			{
				'schemaType': 'property',
				'name': 'lastName',
				'type': 'string'
			},
			{
				'schemaType': 'property',
				'name': 'employer',
				'type': 'relationship',
				'entityName': 'Business'
			},
			{
				'name': 'employerName',
				'type': 'fetched',
				'valueExpression': 'employer.name'
			}
		]
	};

	var schema;

	before(() => {
		schema = new EntitySchema(definition);
	});

	context('#constructor', () => {
		it('should create a new entity schema', function () {
			expect(schema).to.exist;
		});
	});

	context('#getDefinition', () => {
		it('should return the original defintion', () => {
			expect(schema.getDefinition()).to.equal(definition);
		});
	});

	context('#getObjectGraph', () => {
		it('should return the related object graph');
	});

	context('#getName', () => {
		it('should return the name of the entity', () => {
			expect(schema.getName()).to.equal('Person');
		});
	});

	context('#getClassName', () => {
		it('should return the class name of the entity', function () {
			expect(schema.getClassName()).to.equal('PersonObject');
		});
	});

	context('#getClass', () => {
		it('should return the class of the entity');
	});

	context('#getProperties', () => {
		it('should return property schemas', function () {
			var properties = schema.getProperties();

			expect(properties).to.have.length(4);
		});
	});

	context('#getAttributesByName', () => {
		it('should return attribute properties', function () {
			var properties = schema.getAttributesByName();

			expect(properties).to.have.property('firstName');
		});
	});

	context('#getRelationshipsByName', () => {
		it('should return relationship properties', function () {
			var properties = schema.getRelationshipsByName();

			expect(properties).to.have.property('employer');
		});
	});

	context('#getFetchedByName', () => {
		it('should return fetched properties', () => {
			var properties = schema.getFetchedByName();

			expect(properties).to.have.property('employerName');
		});
	});

	context('#getProperties', () => {
		it('should return required properties', () => {
			var properties = schema.getRequiredByName();

			expect(properties).to.have.property('firstName');
		});
	});

	context('#getAffectedEntities', () => {
		it('should return entities affected by this entity');
	});

	context('#getAffectingEntities', () => {
		it('should return entities affecting this entity');
	});

	context('#isAffectedByEntity', () => {
		it('should return entities affected by entity');
	});

	context('#affectsEntity', () => {
		it('should return entities affected by entity');
	});

		// it('should return transient properties', function () {
		// 	var properties = schema.getTransientByName();
		//
		// 	expect(properties).to.have.property('employerName');
		// });
		//
		// it('should return a property by name', function () {
		// 	expect(schema.getPropertyWithName('firstName')).to.have.property('getName');
		// });

		// it("should return affected properties", function(){
		//
		//	 var properties=schema.getPropertiesAffecting("fullName")
		//
		//	 properties.should.have.property("firstName");
		//	 properties.should.have.property("lastName");
		// });
		//
		// it("should return affected properties", function(){
		//
		//	 var properties=schema.getPropertiesAffectedBy("firstName")
		//
		//	 properties.should.have.property("lastName");
		// });
	// });
});
