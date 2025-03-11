// models/fruit.js
const mongoose = require('mongoose');

const fruitSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Fruit = mongoose.model('Fruit', fruitSchema);

module.exports = Fruit;
