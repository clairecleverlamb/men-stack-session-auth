// dependencies 
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const dotenv = require("dotenv");

const authController = require('./controllers/auth');
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
    saveUninitialized: false,
}))

// any HTTP requests from the broswer that comes to /auth..
// will be automatically be forwarded to the router code 
// inside of the authController 
app.use('/auth', authController);

// Mount routes 
app.get('/', (req, res) => {
    res.render('index.ejs', {
        user: req.session.user,
    });
});

// tell the app to listen to the HTTP requests 

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}`);
})