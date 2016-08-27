var should = require('chai').should();

var ObjectGraphSchema = require('../src/schema-definitions/src/object-graph-schema.js');

describe('ObjectGraphSchema', function () {
	context('#constructor', function () {
		it('should create a new object graph schema', function () {
			var definition = {
				'schemaType': 'object-graph',
				'entities': [
					{
						'schemaType': 'entity',
						'name': 'Todo',
						'properties': [
							{
								'schemaType': 'property',
								'name': 'title',
								'type': 'string'

							}
						]
					}
				]
			};

			var schema = new ObjectGraphSchema(definition);

			should.exist(schema);
		});
	});

	context('Querying', function () {
		var definition = {
			'schemaType': 'object-graph',
			'entities': [
				{
					'schemaType': 'entity',
					'name': 'Person',
					'properties': [
						{
							'schemaType': 'property',
							'name': 'name',
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
				},
				{
					'schemaType': 'entity',
					'name': 'Business',
					'properties': [
						{
							'schemaType': 'property',
							'name': 'name',
							'type': 'string'

						}
					]
				}
			]
		};

		var schema = new ObjectGraphSchema(definition);

		it('should return the entities', function () {
			var entities = schema.getEntities();

			entities.should.have.length(2);
		});

		it('should return the entity of a property', function () {
			var personEntity = schema.getEntitiesByName()['Person'];
			var employerProperty = personEntity.getPropertiesByName()['employer'];

			employerProperty.getEntity().should.equal(personEntity);
		});

		it('should return the object graph of an entity', function () {
			var personEntity = schema.getEntitiesByName()['Person'];

			personEntity.getObjectGraph().should.equal(schema);
		});

		it('should return the destination entity of a property', function () {
			var entitiesByName = schema.getEntitiesByName();
			var personEntity = entitiesByName['Person'];
			var businessEntity = entitiesByName['Business'];
			var employerProperty = personEntity.getPropertiesByName()['employer'];

			employerProperty.getDestinationEntity().should.equal(businessEntity);
		});
	});
});
