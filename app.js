var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var serveStatic = require('serve-static')

var indexRouter = require('./routes/index');
const compression = require('compression');
var app = express();
app.use(compression());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

function setCustomCacheControl(res, path) {
  if (serveStatic.mime.lookup(path) === 'text/html') {
    // Custom Cache-Control for HTML files
    res.setHeader('Cache-Control', 'public, max-age=0')
  }
}

app.use(cookieParser());
// app.use(serveStatic(path.join(__dirname, 'public/peflembedded/min'), { 'index': ['heatmaps.html', 'heatmaps.htm'] }))
app.use(serveStatic(path.join(__dirname, 'views')
// , 
// {
//   // maxAge: '1d',
//   // setHeaders: setCustomCacheControl
// }
));

app.use(serveStatic(path.join(__dirname, 'public'), {
  'index': ['heatmaps.html', 'heatmaps.htm']
  
  //, maxAge: '1d',
  // setHeaders: setCustomCacheControl
}))
// app.use(serveStatic(path.join(__dirname, 'public')));
app.set('trust proxy', true);

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;