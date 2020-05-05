const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')

const app = express();

//Pass config
require('./config/passport')(passport);

//Mongoose 
//Connection
const db = require('./config/keys').mongoURI; //import mongouri from key.js
mongoose.connect(db, { useNewUrlParser: true , useUnifiedTopology: true}) //Promise
    .then(() => console.log('Mongoose: Connection successful...'))
    .catch(err => console.log(err))

//ejs Middleware 

app.use(expressLayouts);
app.set('view engine', 'ejs');

//public folder middleware
app.use(express.static(__dirname + '/public'));

//BodyParser //parse data from form

app.use(express.urlencoded({extended:false}));

//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Listening on port ' + PORT))