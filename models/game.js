const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
const gameSchema = new Schema({
	date: Date,
	homeTeam: String,
	awayTeam: String,
	homeTeamGoals: Number,
	awayTeamGoals: Number
});

// Create the model class
const ModelClass = mongoose.model('game', gameSchema);

// Export the model
module.exports = ModelClass;
