'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var symbolCtrlStub = {
  index: 'symbolCtrl.index',
  show: 'symbolCtrl.show',
  create: 'symbolCtrl.create',
  upsert: 'symbolCtrl.upsert',
  patch: 'symbolCtrl.patch',
  destroy: 'symbolCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var symbolIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './symbol.controller': symbolCtrlStub
});

describe('Symbol API Router:', function() {
  it('should return an express router instance', function() {
    symbolIndex.should.equal(routerStub);
  });

  describe('GET /api/symbols', function() {
    it('should route to symbol.controller.index', function() {
      routerStub.get
        .withArgs('/', 'symbolCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/symbols/:id', function() {
    it('should route to symbol.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'symbolCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/symbols', function() {
    it('should route to symbol.controller.create', function() {
      routerStub.post
        .withArgs('/', 'symbolCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/symbols/:id', function() {
    it('should route to symbol.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'symbolCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/symbols/:id', function() {
    it('should route to symbol.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'symbolCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/symbols/:id', function() {
    it('should route to symbol.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'symbolCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
