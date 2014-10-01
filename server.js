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
skynet         = require('skynet'),
errorHandler   = require('errorhandler'),
privateKey     = fs.readFileSync('config/server.key', 'utf8'),
certificate    = fs.readFileSync('config/server.crt', 'utf8');

var credentials = { key : privateKey, cert: certificate};
var port       = process.env.SMS_PORT || 9011;
var sslPort    = process.env.SMS_SECURE_PORT || 9012;
var meshblu    = skynet.createConnection(config.meshblu);
var meshbluAuth = require('./middleware/meshblu-auth');

app = express();
app.use(bodyParser.json());
app.use(session({resave: true, saveUninitialized: true, secret: 'sqrt0fSaturn'}));
app.use(morgan('combined'));
app.use(methodOverride());
app.use(errorHandler());
app.use(express.static(path.join(__dirname, 'public')));

var MessageController = require('./controllers/message-controller');
var messageController = new MessageController();

app.post('/messages', meshbluAuth.authenticate, messageController.create);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(port, function(){
  console.log('Listening on port ' + port);
});

httpsServer.listen(sslPort, function() {
  console.log('HTTPS listening on', sslPort);
});
