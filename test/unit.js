describe('unit tests', function () {

  var hyperquest = require('hyperquest')
    , BufferStream = require('stream-ext').BufferStream
    , req = { on: noop, end: noop }
    , operation = 'CelsiusToFahrenheit'
    , namespace = 'http://www.w3schools.com/webservices/'
    , action = "http://www.w3schools.com/webservices/CelsiusToFahrenheit"
    , message = {'Celsius': '28'}
    , uri = namespace + 'tempconvert.asmx'
    , sandbox
    ;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('foam', function () {
    it('makes an http POST request', function () {
      var mock = sandbox.mock(hyperquest);
      mock.expects('post').once().withArgs(uri).returns(req);
      var foam = require('../foam');
      foam(uri, operation, action, message, {namespace: namespace}, noop);
      mock.verify();
    });

    it('passes the soapaction, content-type and accept-encoding headers', function () {
      var mock = sandbox.mock(hyperquest);
      mock.expects('post').once().withExactArgs(uri, {
        headers: {
          'Accept': "*/*",
          'Accept-Encoding': "gzip",
          'Content-Length': 352,
          'Content-Type': "text/xml;charset=UTF-8",
          'Soapaction': "http://www.w3schools.com/webservices/CelsiusToFahrenheit"
        },
        rejectUnauthorized: undefined,
        secureProtocol: undefined
      }).returns(req);
      var foam = require('../foam');
      foam(uri, operation, action, message, {namespace: namespace}, noop);
      mock.verify();
    });

    it('passes the other options', function () {
      var mock = sandbox.mock(hyperquest);
      mock.expects('post').once().withExactArgs(uri, {
        headers: {
          'Accept': "*/*",
          'Accept-Encoding': "gzip",
          'Content-Length': 352,
          'Content-Type': "text/xml;charset=UTF-8",
          'Soapaction': "http://www.w3schools.com/webservices/CelsiusToFahrenheit"
        },
        rejectUnauthorized: false,
        secureProtocol: 'SSLv3_method'
      }).returns(req);
      var foam = require('../foam');
      foam(uri, operation, action, message, {namespace: namespace, rejectUnauthorized: false, secureProtocol: 'SSLv3_method'}, noop);
      mock.verify();
    });

    it('serializes the request into xml and write it to the request', function () {
      var spyEnd = sandbox.spy(req, 'end');
      sandbox.stub(hyperquest, 'post').withArgs(uri).returns(req);
      var foam = require('../foam');
      foam(uri, operation, action, message, {namespace: namespace}, noop);
      spyEnd.should.have.been.calledWith('<?xml version="1.0" encoding="UTF-8"?><env:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/" ><env:Body><CelsiusToFahrenheit xmlns="http://www.w3schools.com/webservices/"><Celsius>28</Celsius></CelsiusToFahrenheit></env:Body></env:Envelope>');
    });

    it('listens on request\'s response events', function () {
      var spyOn = sandbox.spy(req, 'on');
      sandbox.stub(hyperquest, 'post').withArgs(uri).returns(req);
      var foam = require('../foam');
      foam(uri, operation, action, message, {namespace: namespace}, noop);
      spyOn.should.have.been.calledWith('response');
    });

    it('listens on request\'s error events', function () {
      var spyOn = sandbox.spy(req, 'on');
      sandbox.stub(hyperquest, 'post').withArgs(uri).returns(req);
      var foam = require('../foam');
      foam(uri, operation, action, message, {namespace: namespace}, noop);
      spyOn.should.have.been.calledWithExactly('error', noop);
    });

    it('returns the result as a Javascript object', function (done) {
      var res = new BufferStream(new Buffer('<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><CelsiusToFahrenheitResponse xmlns="http://www.w3schools.com/webservices/"><CelsiusToFahrenheitResult>73.4</CelsiusToFahrenheitResult></CelsiusToFahrenheitResponse></soap:Body></soap:Envelope>'));
      res.headers = {};
      var req = new Request;
      sandbox.stub(hyperquest, 'post').withArgs(uri).returns(req);
      var foam = require('../foam');
      foam(uri, operation, action, message, {namespace: namespace}, function (err, result) {
        result.CelsiusToFahrenheitResponse.CelsiusToFahrenheitResult.should.equal('73.4');
        done();
      });
      req.emit('response', res);
    });

    it('gunzip the response if it is encoded', function (done) {
      var res = new BufferStream(new Buffer('H4sIAAAAAAAEAO29B2AcSZYlJi9tynt/SvVK1+B0oQiAYBMk2JBAEOzBiM3mkuwdaUcjKasqgcplVmVdZhZAzO2dvPfee++999577733ujudTif33/8/XGZkAWz2zkrayZ4hgKrIHz9+fB8/Ih7/Hu8WZXqZ101RLT/7aHe881GaL6fVrFhefPbRuj3fPvjo9zh63FTZ6tHp8jIvq1We0ivL5hE+++yjeduuHt2920zn+SJrxvQVPh9X9cVd/HI315fufqSvvWsK+9bV1dX46h433tvZ2b37e3/x/DUD2i6WTZstp7l7a3bzWx8pok+q2fXR45O8bIp186Z6ls3rfDnPi/ZV3qyqZaMj6ACkIVRV2Yyn1eLuVT5p8vqymObNXYIaB7Uu26MH98b7j+8Ofz/0HaNB33r4yu+GyEf/D4RxMWGaAQAA', 'base64'));
      res.headers = { 'content-encoding': 'gzip' };
      var req = new Request;
      sandbox.stub(hyperquest, 'post').withArgs(uri).returns(req);
      var foam = require('../foam');
      foam(uri, operation, action, message, {namespace: namespace}, function (err, result) {
        result.CelsiusToFahrenheitResponse.CelsiusToFahrenheitResult.should.equal('73.4');
        done();
      });
      req.emit('response', res);
    });

    it('handles incorrect gzip data', function (done) {
      var res = new BufferStream(new Buffer('Incorrect data', 'base64'));
      res.headers = { 'content-encoding': 'gzip' };
      var req = new Request;
      sandbox.stub(hyperquest, 'post').withArgs(uri).returns(req);
      var foam = require('../foam');
      foam(uri, operation, action, message, {namespace: namespace}, function (err, result) {
        err.should.be.an.instanceOf(Error);
        err.message.should.equal('incorrect header check');
        done();
      });
      req.emit('response', res);
    });

  });

  function noop () {}

  var EE = require('events').EventEmitter, util = require('util');
  function Request () {
    EE.call(this);
  }
  util.inherits(Request, EE);
  Request.prototype.end = noop;

});
