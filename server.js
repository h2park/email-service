var express            = require('express');
var http               = require('http');
var https              = require('https');
var path               = require('path');
var fs                 = require('fs');
var morgan             = require('morgan');
var methodOverride     = require('method-override');
var session            = require('express-session');
var bodyParser         = require('body-parser');
var config             = require('./config/config');
var errorHandler       = require('errorhandler');
var _                  = require('lodash');
var MeshbluAuth        = require('express-meshblu-auth');
var expressVersion     = require('express-package-version');
var meshbluHealthcheck = require('express-meshblu-healthcheck');
var meshbluRatelimit   = require('express-meshblu-ratelimit');
var MessageController  = require('./controllers/message-controller');

var meshbluAuth = new MeshbluAuth({
  server: 'meshblu.octoblu.com',
  port: 443,
  protocol: 'https'
});

var messageController = new MessageController();

app = express();
app.set('port', process.env.EMAIL_PORT || process.env.PORT || 80);
app.use(meshbluHealthcheck());
app.use(expressVersion({format: '{"version": "%s"}'}));
app.use(morgan('dev', { skip: function(req, res){ return res.statusCode < 400 }}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(errorHandler());
app.use(meshbluAuth.retrieve());
app.use(meshbluAuth.gateway());
app.use(session({resave: true, saveUninitialized: true, secret: 'sqrt0fSaturn'}));
app.use(meshbluRatelimit());

app.post('/messages', messageController.create);

app.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

process.on('SIGTERM', function(){
  console.log('SIGTERM caught, exiting');
  process.exit(0);
});
