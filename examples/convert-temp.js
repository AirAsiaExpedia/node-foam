var operation = 'CelsiusToFahrenheit'
  , namespace = 'http://www.w3schools.com/webservices/'
  , action = "http://www.w3schools.com/webservices/CelsiusToFahrenheit"
  , message = {'Celsius': '23'};

var foam = require('../foam');

foam(namespace + 'tempconvert.asmx', operation, action, message, {namespace: namespace}, function (err, result) {
  console.log(result.CelsiusToFahrenheitResponse.CelsiusToFahrenheitResult);
});