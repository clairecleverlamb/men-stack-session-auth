const express = require('express');

// constructor obj
const router = express.Router();
//  need to use the module bc we are going to post 
const User = require('../models/user');
const bcrypt = require('bcrypt');

// the router obj is similar to the app obj in server.js
// but it only serves router functionality 

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});

// define a route for post request 
router.post("/sign-up", async (req, res) => {

    // this is a module should've put it in the module 
    const userInDatabase = await User.findOne({username:req.body.username});
    if (userInDatabase) {
        return res.send("Username already taken.");
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.send('Password and Confirm Password do not match!');
    }


    // create encrypted version of paint-text password (hashed and salted) 
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword; 

    const user = await User.create(req.body);
    res.send(`Thanks for signing up! ${user.username}`);

})
// send a page that has a log-in form 
// sign in , dont need async here ~ cuz you need sign up first for sign in 
router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
})

// POST /sign-in route that will be used when log in form is submited 
// confirm a user exists 

router.post('/sign-in', async (req,res) => {
    const userInDatabase = await User.findOne({username:req.body.username});  // repeating here, can be improved if being put in the module
    if(!userInDatabase) {
        return res.send("Login failed. Please try again!");
    }
    const  validPassword = bcrypt.compareSync(
        req.body.password,  //plainTextPassword
        userInDatabase.password  // hashedPassword
    );
    if(!validPassword) {
        return res.send("Login failed. Please try again!");
    };

    // start a login session, we made it past verification; 
    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id  // users obj id 
    };
    res.redirect('/');
})

module.exports = router;