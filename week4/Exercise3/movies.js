const express = require('express');
const authenticate = require('../middleware/authenticate');
const { createMovie, getAllMovies, getMovieById, updateMovie, deleteMovie } = require('../controllers/movieController');

const router = express.Router();

router.get('/', getAllMovies); 
router.get('/:id', getMovieById); 
router.post('/', authenticate, createMovie); 
router.put('/:id', authenticate, updateMovie); 
router.delete('/:id', authenticate, deleteMovie); 

module.exports = router;
