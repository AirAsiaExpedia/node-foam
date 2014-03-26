describe('integration tests', function(){
  describe('foam', function () {
    var foam = require('../foam');

    it('returns the converted temperature', function (done){
      var operation = 'CelsiusToFahrenheit'
        , namespace = 'http://www.w3schools.com/webservices/'
        , action = "http://www.w3schools.com/webservices/CelsiusToFahrenheit"
        , message = {'Celsius': '23'};

      foam(namespace + 'tempconvert.asmx', operation, action, message, {namespace: namespace}, function (err, result) {
        if (err) return done(err);
        result.CelsiusToFahrenheitResponse.CelsiusToFahrenheitResult.should.equal('73.4');
        done();
      });
    });

  });
});


