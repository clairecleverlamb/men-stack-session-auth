// dependencies 
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const dotenv = require("dotenv");


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



// tell the app to listen to the HTTP requests 

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}`);
})