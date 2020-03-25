const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

//Load User model
const User = require('../model/User');

module.exports = function(passport) {
  passport.use( new LocalStrategy({ usernameField: 'email'}, function(email, password, done) {
    User.findOne({ email:email}, (err, user) => {
      if(err) throw err;
      //
      if(!user) {
        return done(null, false, {message: 'Invalid email'})
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if(err) throw err;
        
        if(res) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}