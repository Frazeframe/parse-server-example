// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var SimpleMailgunAdapter = require('parse-server/lib/Adapters/Email/SimpleMailgunAdapter');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://frazeframetester:Frazeframe123@ds017018-a0.mlab.com:17018/fraze-frame',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'JywFR4CxgCLRsb32sksRVA8aLuIuoAlRMqnoqlJV',
  masterKey: process.env.MASTER_KEY || 'rNSMQDmGw5eBMFBuP0OOb0KbEWBcv3CJ23YdfU8i',
  serverURL: process.env.SERVER_URL || 'https://fraze-frame.herokuapp.com/parse',
  fileKey: process.env.FILE_KEY || 'efac82cf-dd00-43bf-9262-f14d7a7cafdb',
  appName: process.env.APP_NAME || 'Frazeframe',
  verifyUserEmails: process.env.VERIFY_USER_EMAIL || true,
  publicServerURL: process.env.SERVER_URL || 'https://fraze-frame.herokuapp.com/parse',
  emailAdapter: new SimpleMailgunAdapter({
    fromAddress: process.env.EMAIL_FROM || 'Frazeframe (no-reply) <noreply@frazeframe.com>',
    domain: process.env.EMAIL_DOMAIN || 'frazeframe.com',
    apiKey: process.env.EMAIL_API_KEY || 'key-cb88e838cef96556e73652bfeb376886'
  }),

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
      },
      {
        pfx: process.env.DEV_PUSH_CERTIFICATE_PATH || 'FFProdPushCert.p12',
        bundleId: 'appsByLukas.com.Fraze-Frame',
        production: true
      }
    ]
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
