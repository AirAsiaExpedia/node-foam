var chai = require("chai");
global.should = chai.should();
global.expect = chai.expect;
global.sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

var replay = require('replay');
// Set mode to `record` to save http requests as fixtures
//replay.mode = "record";
replay.fixtures = __dirname + "/fixtures";
replay.ignore('127.0.0.1');
replay.headers.push(/^soapaction/);
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';