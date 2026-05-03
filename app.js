var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./modules/user/userRoutes');

var app = express();
var expressLayouts = require('express-ejs-layouts');

// view engine setup
app.set("views", path.join(__dirname, "views/pages")); // Pasta das páginas específicas
app.set("layout", path.join(__dirname, "views/layouts/main")); // Onde fica a "casca"
app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'senha_desbravadores_segura',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 dia
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.user = req.session.user || null; // Disponibiliza o usuário para as views
  next();
});

app.use('/', indexRouter);
app.use('/', usersRouter);

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

// Importa o objeto 'sequelize' para conexão com o banco de dados
const sequelize = require('./config/database');
// Importa o modelo User para sincronização
const user = require('./modules/user/userModel');

// Sincroniza o modelo com o banco de dados
sequelize.sync()
    .then(() => console.log('Banco de dados do Cidade Sorriso sincronizado com sucesso!'))
    .catch(err => console.error('Erro ao sincronizar banco:', err));

module.exports = app;
