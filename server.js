var express    = require('express'),
http           = require('http'),
https          = require('https'),
path           = require('path'),
fs             = require('fs'),
morgan         = require('morgan'),
methodOverride = require('method-override'),
session        = require('express-session'),
bodyParser     = require('body-parser'),
config         = require('./config/config'),
errorHandler   = require('errorhandler');
_              = require('lodash');

app = express();
app.set('port', process.env.EMAIL_PORT || process.env.PORT || 80);
app.use(session({resave: true, saveUninitialized: true, secret: 'sqrt0fSaturn'}));
app.use(morgan('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler());

var meshbluAuth = require('express-meshblu-auth');
app.use(meshbluAuth({
  server: 'meshblu.octoblu.com',
  port: 443,
  protocol: 'https'
}));

var meshbluRatelimit = require('express-meshblu-ratelimit');
app.use(meshbluRatelimit());

var meshbluHealthcheck = require('express-meshblu-healthcheck');
app.use(meshbluHealthcheck());


var MessageController = require('./controllers/message-controller');
var messageController = new MessageController();

app.post('/messages', messageController.create);

app.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
