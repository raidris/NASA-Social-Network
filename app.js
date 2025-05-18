var express = require('express');
var path = require('path');
const session = require("express-session");
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// load the routes
const loginRoutes = require('./routes/login')
const registerRoutes = require('./routes/register')
const feedRoutes = require('./routes/feed')

// plug in the body parser middleware and static middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())

app.use(session({
    secret: "somesecretkey",
    resave: false, // Force save of session for each request
    saveUninitialized: false, // Save a session that is new, but has not been modified
    cookie: {maxAge: 10 * 60 * 1000}
}))

// plug in the routes
app.use('/feed', feedRoutes);
app.use('/', loginRoutes);
app.use('/register', registerRoutes);

// plug in the error controller
app.use(errorController.get404);
let port = process.env.PORT || 3000;
app.listen(port);

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});