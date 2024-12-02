const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 1 },
  director: { type: String, required: true, minlength: 1 },
  year: { type: Number, required: true, min: 1900, max: 2100 }
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
