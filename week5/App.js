require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const http = require('http');
const https = require('https');
const selfsigned = require('selfsigned'); 
const { initializeWebSocket } = require('./wsConnection');

const app = express();
const HTTP_PORT = process.env.PORT || 3010;
const HTTPS_PORT = 3443; //HTTPS port

const attrs = [{ name: 'commonName', value: 'localhost' }];
const options = { days: 365 }; 
const { private: privateKey, cert: certificate } = selfsigned.generate(attrs, options);

const sslOptions = {
    key: privateKey,
    cert: certificate,
};

// HTTP server
const httpServer = http.createServer(app);

initializeWebSocket(httpServer);

//const { WebSocketServer } = require('ws');//library

// creat HTTPS server
const httpsServer = https.createServer(sslOptions, app);

app.use(express.json());
// Add the root route handler 
app.get('/', (req, res) => { res.send("Welcome to the system over HTTPS!"); });

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

app.use('/auth', authRoutes);
app.use('/movies', movieRoutes);

// start HTTP server
httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP server running on http://localhost:${HTTP_PORT}`);
});

// start HTTPS server
httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS server running on https://localhost:${HTTPS_PORT}`);
});


process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
