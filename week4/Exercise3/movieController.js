const Joi = require('joi');
const Movie = require('../models/Movie');

const joiMovieSchema = Joi.object({
  title: Joi.string().min(1).required(),
  director: Joi.string().min(1).required(),
  year: Joi.number().integer().min(1900).max(2100).required()
});

const createMovie = async (req, res) => {
  try {
    const { error } = joiMovieSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const newMovie = new Movie(req.body);
    const result = await newMovie.save();
    res.status(201).json(result);
  } catch (err) {
    console.error('Error saving new movie:', err);
    res.status(500).send(err);
  }
};

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    console.log('Movies fetched:', movies);
    res.setHeader('Content-Type', 'application/json');
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

const updateMovie = async (req, res) => {
  try {
    const updatedData = req.body;
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updatedMovie);
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteMovie = async (req, res) => {
  try {
    const result = await Movie.findByIdAndDelete(req.params.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie
};
