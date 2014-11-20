var express = require('express'),
http        = require('http'),
https        = require('https'),
path        = require('path'),
fs          = require('fs'),
morgan        = require('morgan'),
methodOverride = require('method-override'),
session        = require('express-session'),
bodyParser     = require('body-parser'),
config         = require('./config/config'),
meshblu        = require('meshblu'),
errorHandler   = require('errorhandler');
_              = require('lodash');

var meshblu    = meshblu.createConnection(_.clone(config.meshblu));
var meshbluAuth = require('./middleware/meshblu-auth');

app = express();
app.set('port', process.env.EMAIL_PORT || process.env.PORT || 9011);
app.use(session({resave: true, saveUninitialized: true, secret: 'sqrt0fSaturn'}));
app.use(morgan('combined'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler());

var MessageController = require('./controllers/message-controller');
var messageController = new MessageController();

app.post('/messages', meshbluAuth.authenticate, messageController.create);

app.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
