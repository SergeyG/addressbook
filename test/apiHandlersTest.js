/* global describe, xdescribe, before, beforeEach, it, xit, after */
const chai = require('chai');
const dust = require('dustjs-linkedin');
const expect = chai.expect;
const ObjectId = require('mongodb').ObjectID;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const stubReq = require('./req').stubForValidation;
const templCompilers = require('../app/custom/templ_compilers');
const apiHandlers = require('../app/handlers/api');
const bookSvc = require('../app/models/book');
const db = require('../config/database').Database;

/**
 * Test suite for API handlers
 */
describe('API Handlers TestSuite', function () {
    process.env.NODE_ENV = 'test';
    chai.use(sinonChai);
    const compilers = templCompilers(); /** load, compile and cache partial templates for ajax query */
    compilers.compileAll();
    before('should connect all services to database', (done) => {
        db.getDb(done);
    });
    let req = null;
    beforeEach('should connect all services to database', (done) => {
        return stubReq(function (r) {
            req = r;
            return done();
        });
    });
    describe('Edit Record', function () {
        let updateTaskStub;
        before('Make stub', (done) => {
            updateTaskStub = sinon.stub(bookSvc, 'update');
            updateTaskStub.callsFake(payload => Promise.resolve({
                insertedId: new ObjectId(),
                result: {
                    ok: 1
                }
            }));
            done();
        });
        it('should return error - required fields are not specified', (done) => {
            apiHandlers.updateAddress(req, {
                json(result) {
                    expect(result).not.to.be.null;
                    expect(result.success).to.be.false;
                    done();
                }
            });
        });
        it('should return ok - record updated successfully', (done) => {
            req.dust = dust;
            req.compilers = compilers;
            req.params.addressId = new ObjectId();
            req.body = {
                firstname: 'subject',
                lastname: '01/05/2017',
                email: 'sv@bla-bla-bla.com'
            };
            apiHandlers.updateAddress(req, {
                json(result) {
                    expect(result).not.to.be.null;
                    expect(result.success).to.be.true;
                    done();
                }
            });
        });
        after('should cleanup stub', (done) => {
            updateTaskStub.restore();
            done();
        });
    });
    describe('Delete Record', function () {
        let deleteTaskStub;
        before('Make stub', (done) => {
            deleteTaskStub = sinon.stub(bookSvc, 'deleteAddress');
            deleteTaskStub.callsFake(payload => Promise.resolve({
                insertedId: new ObjectId(),
                result: {
                    ok: 1
                }
            }));
            done();
        });
        it('should return error - required fields are not specified', (done) => {
            apiHandlers.deleteAddress(req, {
                json(result) {
                    expect(result).not.to.be.null;
                    expect(result.success).to.be.false;
                    done();
                }
            });
        });
        it('should return ok - record deleted successfully', (done) => {
            req.params.addressId = new ObjectId();
            apiHandlers.deleteAddress(req, {
                json(result) {
                    expect(result).not.to.be.null;
                    expect(result.success).to.be.true;
                    done();
                }
            });
        });
        after('should cleanup stub', (done) => {
            deleteTaskStub.restore();
            done();
        });
    });
});
