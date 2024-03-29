var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');
var schema = mongoose.Schema;




// var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);

//load files from model directory
fs.readdirSync(__dirname + '/models').forEach(function(fileName){
	require(__dirname + '/models/' + fileName);
});


var userSchema = new schema({
	name: String,
	languages: String,
	age: Number
                            
});
mongoose.connect('mongodb://localhost/test');
mongoose.model('utkusers', userSchema);

app.get('/', function(req, res, next){
	// res.send({name: 'Utkal Nayak'});
	res.render('index',{title: 'Utkal'});
});

app.get('/users/:userid', function(req, res, next){
	var reqId =  req.param('userid');
		mongoose.model('utkusers').find({age: req.params.userid}, function(err, users){
		res.send(users);
});
});

app.get('/enter', function(req, res, next){
	mongoose.model('utkusers').find(function(err, users){
		res.send(users);
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

