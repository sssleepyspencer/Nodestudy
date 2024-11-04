const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello from Server');
    } else if (req.url === '/data' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        const data = {
            user: {
                name: 'Miaomiao Kang',
                age: 29,
                location: 'Tampere'
            }
        };
        res.end(JSON.stringify(data));
    } else {
        res.statusCode = 404;
        res.end('Not Found\n');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:3000/`);
});


    