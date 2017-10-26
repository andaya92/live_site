
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , file_form = require('./routes/file_form')
  , http = require('http')
  , path = require('path');
//grab the javascript file
var about = require('./routes/about');
var create_form = require('./routes/create_form');
var showDetails = require('./routes/showDetails');
var editEntry = require('./routes/editEntry');
var search_form = require('./routes/search_form');


var expressValidator = require('express-validator');

//let express handle user requests
var app = express();


// all environments
//how views are handleda
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
//how data is logged and parsed
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname+ '/public'));//changed from path.join(a,b) because joining strings this way did not work well on windows apparently...
app.use(expressValidator());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//request pages, and how to handle
app.get('/', routes.index);
	//when requesting about page, use the about variable with the exported function (used as callback for app.get function)
app.get('/about', about.showPage);
app.get('/file_form', file_form.list);
app.get('/create_form', create_form.showForm);
app.get('/create_form_dairy', create_form.showForm_dairy);
app.get('/showDetails', showDetails.showPage);
app.get('/showDetails/form', showDetails.showPage_form);
app.get('/editEntry', editEntry.showPage);
app.get('/search_form', search_form.display_form);
app.get('/editEntry/form', editEntry.edit_form);


app.post('/file_form', file_form.post_annual_report);
app.post('/create_form', create_form.post);
app.post('/create_form_dairy', create_form.post_dairy);
app.post('/about', about.post);
app.post('/editEntry', editEntry.updateForm);
app.post('/editEntry/updateForm_dairy', editEntry.updateForm_dairy);
app.post('/search_form', search_form.display_results);
app.post('/editEntry/form', editEntry.updateForm_report);
//app.post('/showDetails', showDetails.post);



http.createServer(app).listen(app.get('port'), '10.138.8.38', function(){
  console.log('Express server listening on port ' + app.get('port'));
});
