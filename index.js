// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;

var databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://frazeframetester:Frazeframe123@ds017018-a0.mlab.com:17018/fraze-frame',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'JywFR4CxgCLRsb32sksRVA8aLuIuoAlRMqnoqlJV',
  masterKey: process.env.MASTER_KEY || 'rNSMQDmGw5eBMFBuP0OOb0KbEWBcv3CJ23YdfU8i', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337',  // Don't forget to change to https if needed
  fileKey: 'efac82cf-dd00-43bf-9262-f14d7a7cafdb',

  push: {
    android: {
      senderId: '...',
      apiKey: '...'
    },
    ios: [
      {
        pfx: process.env.DEV_PUSH_CERTIFICATE_PATH || 'FFDevPushCert.p12',
        bundleId: 'appsByLukas.com.Fraze-Frame',
        production: false
      }
    ]
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a web site.');
});

var port = process.env.PORT || 1337;
app.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});
