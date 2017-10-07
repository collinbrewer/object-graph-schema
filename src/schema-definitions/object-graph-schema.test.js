var should = require('chai').should();
const { expect } = require('chai');

var ObjectGraphSchema = require('./object-graph-schema.js');

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

	context('Indexing', () => {
		const objectGraph = new ObjectGraphSchema({
			'schemaType': 'object-graph',
			'entities': [
				{
					'schemaType': 'entity',
					'name': 'Person',
					'properties': [
						{
							'schemaType': 'property',
							'name': 'firstName',
							'type': 'string'
						},
						{
							schemaType: 'property',
							name: 'parent',
							type: 'relationship',
							entityName: 'Person'
						},
						{
							schemaType: 'property',
							name: 'children',
							entityName: 'Person',
							predicate: 'parent == $FETCH_SOURCE'
						},
						{
							schemaType: 'property',
							name: 'numberOfChildren',
							valueExpression: '@sum.children'
						}
					]
				},
				{
					schemaType: 'entity',
					name: 'Business',
					properties: [
						{
							schemaType: 'property',
							name: 'nameOfCEO',
							valueExpression: 'ceo.firstName'
						},
						{
							schemaType: 'property',
							type: 'fetched',
							name: 'employeesWithChildren',
							entityName: 'Person',
							predicate: 'employer == $FETCH_SOURCE && numberOfChildren > 0'
						}
					]
				}
			]
		});

		it('should index all relationships', () => {
			const index = objectGraph.getIndex();
			const personIndex = index.entitiesByName.Person.index;
			const businessIndex = index.entitiesByName.Business.index;

			expect(personIndex.propertiesByName.firstName.index.affectedBy).to.deep.equal({ SELF: {} });
			expect(personIndex.propertiesByName.children.index.affectedBy).to.deep.equal({ Person: { parent: true } });
			expect(personIndex.propertiesByName.numberOfChildren.index.affectedBy).to.deep.equal({ SELF: { children: true } });
			expect(businessIndex.propertiesByName.nameOfCEO.index.affectedBy).to.deep.equal({ SELF: { ceo: true } });
			expect(businessIndex.propertiesByName.employeesWithChildren.index.affectedBy).to.deep.equal({ Person: { employer: true, numberOfChildren: true } });
		});
	});
});
