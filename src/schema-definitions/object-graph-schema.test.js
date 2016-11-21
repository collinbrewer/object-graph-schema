import {expect} from 'chai';
import ObjectGraphSchema from './object-graph-schema.js';

describe('ObjectGraphSchema', () => {
	var definition = {
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
						name: 'nickname',
						valueExpression: 'firstName'
					},
					{
						'schemaType': 'property',
						'name': 'employer',
						'type': 'relationship',
						'destinationEntity': 'Company'
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
				'name': 'Company',
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

	context('#constructor', () => {
		it('should create a new object graph schema', () => {
			expect(schema).to.exist;
		});
	});

	context('getEntities', () => {
		it('should return the entities', () => {
			expect(schema.getEntities()).to.have.length(2);
		});
	});

	context('getEntitiesByName', () => {
		it('should return the entities by name', () => {
			expect(schema.getEntitiesByName()).to.have.property('Person');
		});
	});

	context('getEntity', () => {
		it('should return the entity with the given', () => {
			expect(schema.getEntity('Person')).to.exist;
			expect(schema.getEntity('Person').getName()).to.equal('Person');
		});
	});

	context('getProperties', () => {
		it('should return all properties', () => {
			expect(schema.getProperties()).to.have.length(4);
		});
	});

	context('Entity Associations', () => {
		it('Person should be affected by Company', () => {
			expect(schema.getEntity('Person').isAffectedByEntity('Company')).to.be.true;
		});

		it('Person should not affect Company', () => {
			expect(schema.getEntity('Person').affectsEntity('Company')).to.be.false;
		});

		it('Company should not be affected by Person', () => {
			expect(schema.getEntity('Company').isAffectedByEntity('Person')).to.be.false;
		});

		it('Company should affect Person', () => {
			expect(schema.getEntity('Company').affectsEntity('Person')).to.be.true;
		});
	});

	context('Associations', () => {
		it('Person.nickname should have 1 affecting property', () => {
			var nickname = schema.getEntity('Person').getProperty('nickname');
			expect(nickname.getAffectingProperties()).to.have.length(1);
		});

		it('Person.nickname should have 0 affected properties', () => {
			var nickname = schema.getEntity('Person').getProperty('nickname');
			expect(nickname.getAffectedProperties()).to.have.length(0);
		});

		it('Person.firstName should have 0 affecting properties', () => {
			var firstName = schema.getEntity('Person').getProperty('firstName');
			expect(firstName.getAffectingProperties()).to.have.length(1);
		});

		it('Person.firstName should have 1 affected property', () => {
			var firstName = schema.getEntity('Person').getProperty('firstName');
			expect(firstName.getAffectingProperties()).to.have.length(1);
		});

		it('Person.firstName should affect Person.nickname', () => {
			var firstName = schema.getEntity('Person').getProperty('firstName');
			var nickname = schema.getEntity('Person').getProperty('nickname');
			expect(firstName.affectsProperty(nickname)).to.be.true;
		});

		it('Person.firstName should be affected by Person.nickname', () => {
			var firstName = schema.getEntity('Person').getProperty('firstName');
			var nickname = schema.getEntity('Person').getProperty('nickname');
			expect(nickname.isAffectedByProperty(firstName)).to.be.true;
		});

		it('Company.name should not be affected by Person.firstName', () => {
			var companyName = schema.getEntity('Company').getProperty('name');
			var personFirstName = schema.getEntity('Person').getProperty('firstName');
			expect(companyName.isAffectedByProperty(personFirstName)).to.be.false;
		});

		it('Person.name should not be affected by Company.name', () => {
			var companyName = schema.getEntity('Company').getProperty('name');
			var personFirstName = schema.getEntity('Person').getProperty('firstName');
			expect(personFirstName.isAffectedByProperty(companyName)).to.be.false;
		});

		it('Person.employerName should be affected by Company.name', () => {
			var companyName = schema.getEntity('Company').getProperty('name');
			var personEmployerName = schema.getEntity('Person').getProperty('employerName');
			expect(personEmployerName.isAffectedByProperty(companyName)).to.be.true;
		});

		it('Person.employerName should not affect Company.name', () => {
			var companyName = schema.getEntity('Company').getProperty('name');
			var personEmployerName = schema.getEntity('Person').getProperty('employerName');
			expect(personEmployerName.affects(companyName)).to.be.false;
		});

		it('Company.name should affect Person.employerName', () => {
			var affectedProperty = schema.getEntity('Company').getProperty('name');
			expect(schema.getEntity('Person').getProperty('name').affectsProperty(affectedProperty)).to.be.true;
		});
	});
});
