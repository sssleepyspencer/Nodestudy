const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let data = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Pear' },
];

app.get('/data', (req, res) => {
    res.status(200).json(data);
});

app.post('/data', (req, res) => {
    const newItem = {
        id: data.length + 1,
        name: req.body.name,
    };
    data.push(newItem);
    res.status(201).json(newItem);
});

app.get('/api', (req, res) => {
    res.status(200).send('API is up and running');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:3000`);
});
