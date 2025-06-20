var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql2/promise');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
let db;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/users', usersRouter);
app.use('/users', usersRouter);
app.use('/users', usersRouter);

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
  // res.render('error');
  res.json({
    error: {
      message: err.message || 'manual error',
      status: err.status || 500
    }
  });
});

// Initialize MySQL and insert test data
(async () => {
  try {
    // Connect to MySQL (no DB yet)
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '' // your MySQL password
    });

    await connection.query('CREATE DATABASE IF NOT EXISTS DogWalkService');
    await connection.end();

    // Now connect to DogWalkService
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });

    // Create Users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('owner', 'walker') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert user data if table is empty
    const [userCount] = await db.execute('SELECT COUNT(*) AS count FROM Users');
    if (userCount[0].count === 0) {
      await db.execute(`
        INSERT INTO Users (username, email, password_hash, role) VALUES
        ('alice123', 'alice@example.com', 'hashed123', 'owner'),
        ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
        ('carol123', 'carol@example.com', 'hashed789', 'owner')
      `);
    }

    // TODO: Add Dogs, WalkRequests, etc. in similar way...

    app.locals.db = db; // Save db connection for route use

  } catch (err) {
    console.error('Failed to setup DogWalkService database:', err);
  }
})();

module.exports = app;
