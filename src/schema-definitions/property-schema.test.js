var should = require('chai').should();
import {expect} from 'chai';

var PropertySchema = require('./property-schema.js');

describe('PropertySchema', () => {
	var definition = {'name': 'title', 'ivar': 'title-ivar', 'type': 'string'};
	var schema = new PropertySchema(definition);

	context('constructor', () => {
		it('should create a new property schema', () => {
			should.exist(schema);
		});
	});

	context('getDefinition', () => {
		it('should return the original definition', () => {
			expect(schema.getDefinition()).to.equal(definition);
		});
	});

	context('getEntity', () => {
		it('should return the parent entity', () => {
			expect(schema.getEntity()).to.be.undefined;
		});
	});

	context('getName', () => {
		it('should return the name of the property', () => {
			schema.should.have.property('getName');
			schema.getName().should.equal('title');
		});
	});

	context('getType', () => {
		it('should return the type of the property', () => {
			schema.getAttributeType().should.equal('string');
		});
	});

	context('getAttributeType', () => {
		schema.getAttributeType().should.equal('string');
	});

	context('isRequired', () => {
		it('should not be required', () => {
			schema.isRequired().should.equal(false);
		});
	});

	context('isTransient', () => {
		it('should not be required', () => {
			schema.isTransient().should.equal(false);
		});
	});

	context('isToMany', () => {
		it('should return the relationship type', () => {
			schema.isToMany().should.equal(false);
		});
	});

	context.only('getDestinationEntity', () => {
		it('should return the originalentity', () => {
			let d = {'name': 'friend', 'type': 'relationship', 'entityName': 'Person'};
			let s = new PropertySchema(d);
			expect(s.getDestinationEntity()).to.be.undefined; // PersonEntity
		});

		it('should return the relationships destination entity', () => {
			let d = {'name': 'friend', 'type': 'relationship', 'entityName': 'Person'};
			let s = new PropertySchema(d);
			expect(s.getDestinationEntity()).to.be.undefined; // PersonEntity
		});
	});

	context('getDeleteRule', () => {
		it('should return the delete rule for a property', () => {
			let d = {'name': 'friend', 'type': 'relationship', 'entityName': 'Person', 'deleteRule': 'cascade'};
			let schema = new PropertySchema(d);
			schema.getDeleteRule().should.equal('cascade');
		});
	});

	context('getEntityName', () => {
		it('should return the entity name of the relationship', () => {
			let d = {'name': 'friend', 'type': 'relationship', 'entityName': 'Person', 'deleteRule': 'cascade'};
			let schema = new PropertySchema(d);
			schema.getEntityName().should.equal('Person');
		});
	});

	context('getPermission', () => {
		it('should return the permission', () => {
			schema.getPermission().should.equal('readwrite');
		});
	});

	context('getIvar', () => {
		it('should return the ivar name', () => {
			schema.getIvar().should.equal('title-ivar');
		});
	});

	context('getSetterName', () => {
		it('should return the setter name', () => {
			schema.getSetterName().should.equal('setTitle');
		});
	});

	context('getGetterName', () => {
		it('should return the getter name', () => {
			schema.getGetterName().should.equal('getTitle');
		});
	});

	context('getCheckerName', () => {
		it('should return the checker name', () => {
			schema.getCheckerName().should.equal('hasTitle');
		});
	});

	context('getFetcherName', () => {
		it('should return the fetcher name', () => {
			schema.getFetcherName().should.equal('fetchTitle');
		});
	});

	context('getAffectingProperties', () => {
		it('should return properties affecting this property', () => {
			expect(schema.getAffectingProperties()).to.be.empty;
		});
	});

	context('getAffectedProperties', () => {
		it('should return properties affected by this property', () => {
			expect(schema.getAffectedProperties()).to.be.empty;
		});
	});

	context('isAffectedByProperty', () => {
		it('should return false', () => {
			expect(schema.isAffectedByProperty('unrelated')).to.be.false;
		});
	});

	context('affectsProperty', () => {
		it('should return false', () => {
			expect(schema.affectsProperty('unrelated')).to.be.false;
		});
	});
});
