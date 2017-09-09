const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
const fechaSchema = new Schema({
	number: Number,
	games: { type:Array },
  closingDate: Date
});

// Create the model class
const ModelClass = mongoose.model('fecha', fechaSchema);

// Export the model
module.exports = ModelClass;
