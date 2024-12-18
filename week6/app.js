require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const tasksRouter = require('./routes/tasks');
const authRouter = require('./routes/auth');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Task Manager!');
});

app.use('/tasks', tasksRouter);
app.use('/auth', authRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
