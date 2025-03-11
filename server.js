// dependencies 
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const dotenv = require("dotenv");

const authController = require('./controllers/auth');
const fruitController = require('./controllers/fruits')
const session = require('express-session');

//  init express app
const app = express();

// config settings
dotenv.config();
const port = process.env.PORT ? process.env.PORT : "3000";

// connect to MONGODB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
})

// Mount middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use((req, res, next) => {
    if (req.session.message) {
        // res.local makes info avail to templates: to all the ejs in fruits
        // res is the response obj
        // the response obj is part of our communication with the client 
        res.locals.message = req.session.message;
        // now we clear out req.session.message
        req.session.message = null;
    }
    // now we can pass along the request to our routes 
    next(); // next calls the next middleware function or route handler
    // note: route handlers are a type of middleware 
})

// any HTTP requests from the broswer that comes to /auth..
// will be automatically be forwarded to the router code 
// inside of the authController 
app.use('/auth', authController);
app.use('/fruits', fruitController);

// Mount routes 
app.get('/', (req, res) => {
    res.render('index.ejs', {
        user: req.session.user,
    });
});

// protected routes - user must be logged in for access 
app.get('/vip-lounge', (req, res) => {
    if (req.session.user) {
        res.send(`Welcome to the VIP Lounge ${req.session.user.username}`);
    } else {
        res.send("Sorry, you must be logged for that");
    }
});

// the catch all route should ALWAYS be listed last 
app.get('*', (req, res) => {
    res.status(404).render('error.ejs', { msg: "Page not found! "})
})

const handleServerError = (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Warning! Port ${port} is already taken`);
    } else {
        console.log('error', handleServerError);
    } 
}

// tell the app to listen to the HTTP requests 
app.listen(port, () => {
    console.log(`The express app is ready on port ${port}`);
}).on('error', handleServerError);