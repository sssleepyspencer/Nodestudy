const express = require('express');
const authenticate = require('../middleware/authenticate');
const { createMovie, getAllMovies, getMovieById, updateMovie, deleteMovie } = require('../controllers/movieController');

const router = express.Router();

router.get('/', authenticate(['admin', 'regular']), getAllMovies);
router.get('/:id', authenticate(['admin', 'regular']), getMovieById);
router.post('/', authenticate(['admin']), createMovie); 
router.put('/:id', authenticate(['admin']), updateMovie); 
router.delete('/:id', authenticate(['admin']), deleteMovie); 

module.exports = router;
