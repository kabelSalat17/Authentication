const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')

//Schema imported

const User = require('../models/User')


//Login Page
router.get('/login' , (req,res) => res.render('login'));

//Register
router.get('/register' , (req,res) => res.render('register'));

//register post

router.post('/register', (req,res) => {
    const {name, email, password, password2} = req.body;
    let errors = [];
    //ERRORS
    //Check required
    if (!name || !email || !password || !password2) { //all field are required
        errors.push({msg: ' All fields are requried'});
    }

    //Password matching

    if(password !== password2) { 
        errors.push({msg : "Passwords don't match"});
    }

    //Check pass length

    if(password.length < 8) {
        errors.push({msg: 'Password too short!'})
    }

    if(errors.length>0) {
        res.render('register' , {
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        // Validation with Schema
        User.findOne({email:email}) //find a record in database with the same email
            .then(user => {
                if(user) {
                    //user already exits
                    errors.push({msg: 'Email : Email is already registered'})
                    res.render('register' , {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else{
                    const newUser = new User({ //new data
                        name,
                        email,
                        password
                    });

                    // Hash Password
                    bcrypt.genSalt(10,(err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            //set pass to hash
                            newUser.password = hash;
                            //Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                    }) )
                }
            })
    }

    //**ERRORS
});

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logged out');//green with this message
    res.redirect('/users/login');
});

module.exports = router