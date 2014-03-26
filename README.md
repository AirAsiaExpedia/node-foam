# foam

Simple SOAP client for NodeJS.
This module was created because none of the existing SOAP modules (most modules depend of https://www.npmjs.org/package/soap)
would work with a third-party partner WSDL. As SOAP is just a POST request over HTTP, **foam** bypasses the WSDL
discovery and just posts the data to the endpoint (which anyhow performs better than using the WSDL).

**foam** process the message and serialize it in a SOAP envelope and body, and parse the XML response into
a Javascript object.

## Usage

    npm install foam --save

```js
var operation = 'CelsiusToFahrenheit'
    , namespace = 'http://www.w3schools.com/webservices/'
    , action = "http://www.w3schools.com/webservices/CelsiusToFahrenheit"
    , message = {'Celsius': '23'}
    , uri = namespace + 'tempconvert.asmx'
    ;

var foam = require('foam');

foam(uri, operation, action, message, {namespace: namespace},
  function (err, result) {
    console.log(result.CelsiusToFahrenheitResponse.CelsiusToFahrenheitResult);
  }
);
```

### Parameters

- `uri` - endpoint of the SOAP service
- `operation` - SOAP operation
- `action` - `Soapaction` http header
- `message` - a Javascript object that will be serialised to XML
- `options` - an options object

### Options

- `header` - optional SOAP header
- `namespace` - optional xmlns namespace for the `operation`
- `namespaces` - optional additional namespaces for the `Envelope` element
- `benchmark` - set to true to log the request timing to the console, defaults **false**
