const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json()); 

let movies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
  { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
  { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 }
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
  res.json(movies);
});

app.post('/movies', (req, res) => {
  const newMovie = req.body;

  if (!newMovie.title || !newMovie.director || !newMovie.year) {
    console.log('Invalid request body:', newMovie);
    return res.status(400).send('Invalid request: Missing fields');
  }

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

app.put('/movies/:id', (req, res) => {
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

    res.status(200).json({
      message: "Movie deleted successfully",
      deletedMovie: deletedMovie[0]
    });
  } else {
    res.status(404).send('Movie not found');
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:3000`);
});
