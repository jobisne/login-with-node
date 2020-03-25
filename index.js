const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const routeHome = require('./routes/index');
const routerUser = require('./routes/users');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const app = express();

//Passport config
require('./config/passport')(passport);

//Mongoose connection -- Db Config
const db = require('./config/keys').MongoURI;

//Connect to mongoose
mongoose.connect(db, {useNewUrlParser : true, useUnifiedTopology: true })
.then(() => {console.log('Mongodb Connected')})
.catch(err => {console.log(err)})

//Ejs layout
app.use(expressLayouts);
app.set('view engine', 'ejs');

//body parser
app.use(express.urlencoded({ extended: false }))

//Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global variable for flash
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');

  next();
})

//Routes
app.use('/', routeHome);
app.use('/users/', routerUser);


const PORT = process.env.PORT || 5000

app.listen(PORT, () => { console.log(`server listen at port ${PORT}`)})
