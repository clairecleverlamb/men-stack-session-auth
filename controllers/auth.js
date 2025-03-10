const express = require('express');

// constructor obj
const router = express.Router();

// the router obj is similar to the app obj in server.js
// but it only serves router functionality 

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});


module.exports = router;