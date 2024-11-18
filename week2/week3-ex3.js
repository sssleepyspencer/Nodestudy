const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3003;

app.use(bodyParser.json());

let movies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
  { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
  { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 },
  { id: 4, title: "Toy Story 3", director: "Lee Unkrich", year: 2010 },
  { id: 5, title: "Avengers: Endgame", director: "Anthony and Joe Russo", year: 2019 }
];

app.get('/', (req, res) => {
  let movieList = '<h1>Movie Collection</h1><ul>';
  movies.forEach(movie => {
    movieList += `<li>${movie.title} (${movie.year}) - Directed by ${movie.director}</li>`;
  });
  movieList += '</ul>';
  res.send(movieList);
});

app.get('/movies', (req, res) => {
  const { title, year, director } = req.query;
  let filteredMovies = movies;

  if (title) {
    filteredMovies = filteredMovies.filter(movie => movie.title.toLowerCase().includes(title.toLowerCase()));
  }
  if (year) {
    filteredMovies = filteredMovies.filter(movie => movie.year === parseInt(year));
  }
  if (director) {
    filteredMovies = filteredMovies.filter(movie => movie.director.toLowerCase().includes(director.toLowerCase()));
  }

  res.json(filteredMovies);
});

app.post('/movies', [
  body('title').notEmpty().withMessage('Title is required'),
  body('director').notEmpty().withMessage('Director is required'),
  body('year').isInt({ min: 1888, max: new Date().getFullYear() }).withMessage('Year must be a valid number within the range')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newMovie = req.body;
  newMovie.id = movies.length ? movies[movies.length - 1].id + 1 : 1;
  movies.push(newMovie);

  res.status(201).json({
    message: "Movie added successfully",
    newMovie
  });
});

app.get('/movies/:id', (req, res) => {
  const movieId = parseInt(req.params.id);
  const movie = movies.find(m => m.id === movieId);

  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send('Movie not found');
  }
});

app.put('/movies/:id', [
  body('title').optional().notEmpty().withMessage('Title is required'),
  body('director').optional().notEmpty().withMessage('Director is required'),
  body('year').optional().isInt({ min: 1888, max: new Date().getFullYear() }).withMessage('Year must be a valid number within the range')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const movieId = parseInt(req.params.id);
  const movie = movies.find(m => m.id === movieId);

  if (movie) {
    if (req.body.title) movie.title = req.body.title;
    if (req.body.director) movie.director = req.body.director;
    if (req.body.year) movie.year = req.body.year;

    res.json({
      message: "Movie updated successfully",
      updatedMovie: movie
    });
  } else {
    res.status(404).send('Movie not found');
  }
});

app.delete('/movies/:id', (req, res) => {
  const movieId = parseInt(req.params.id);
  const movieIndex = movies.findIndex(m => m.id === movieId);

  if (movieIndex !== -1) {
    const deletedMovie = movies.splice(movieIndex, 1);

    res.status(204).send(); 
  } else {
    res.status(404).send('Movie not found');
  }
});

app.use((req, res) => {
  res.status(404).send('Route not found');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:3003`);
});
