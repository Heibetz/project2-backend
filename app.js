var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var http = require('http');
var db = require('./.github/workflows/app/models');
var cookieParser = require('cookie-parser');
var indexRouter = require('./.github/workflows/app/routes/index');
var coursesRouter = require('./.github/workflows/app/routes/courses');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/courses-t5/courses', coursesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Start server if run directly (not when imported)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  (async () => {
    try {
      await db.sequelize.authenticate();
      // Do not force sync; assumes tables already exist
      await db.sequelize.sync();
      app.set('port', PORT);
      http.createServer(app).listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  })();
}

module.exports = app;
