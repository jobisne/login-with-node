const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//bring model
const User = require('../model/User');

//Get login page
router.get('/login', (req, res) => {
  res.render('login');
});

//Get Register page
router.get('/register', (req, res) => {
  res.render('register');
});

//Post user
router.post('/register', (req, res) => {
  // console.log(req.body);
  const { name, email, password, password2 } = req.body;
  let errors = [];
  let msg;
  //Check all fields
  if (!name || !email || !password || !password2) {
    msg = 'Please fill all the filds';
    errors.push(msg);
  }

  //Check passwors if match
  if (password !== password2) {
    msg = 'Password did not match';
    errors.push(msg);
  }

  //check password length
  if (password.length < 6) {
    msg = 'Password should be at least 6 characters';
    errors.push(msg);
  }
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //Validation passed
    const newUser = new User({
      name,
      email,
      password
    });

    //hash password
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        if (err) throw err;

        //set password to hash
        newUser.password = hash;
        //save user
        newUser
          .save()
          .then(user => {
            console.log(`record save successfully ${user}`);
            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/users/login');
          })

          .catch(err => console.log(err));
      });
    });
  }
});

//Login User
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
})

module.exports = router;
