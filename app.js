// Load environment variables from .env
require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var http = require('http');
var db = require('./app/models');
var cookieParser = require('cookie-parser');
var indexRouter = require('./app/routes/index');
var coursesRouter = require('./app/routes/courses');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var coursesRouter = require('./routes/courses');

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

// Enable CORS for frontend (Vite runs on 5173 by default)
app.use(cors({ origin: ['http://localhost:5173','http://127.0.0.1:5173'] }));

app.use('/', indexRouter);
app.use('/api/courses', coursesRouter);
app.use('/users', usersRouter);
app.use('/api/courses', coursesRouter);


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

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
