const http = require('http');

const url = require('url');

const { parse } = require('querystring');

const entries = [];

const server = http.createServer((req, res) => {

    const {pathname, query} = url.parse(req.url, true);

    switch(req.method) {

        case 'GET':

            res.writeHead(200, {'Content-Type': 'text/html'});

            res.write('<table><tr><th>Timestamp</th><th>Action</th><th>Data</th></tr>');

            for(let i = entries.length - 1; i >= 0; i--) {

                res.write(entries[i]);

            }

            res.write('</table>');

            res.end();

            break;

        case 'POST':

            let body = '';

            req.on('data', chunk => {

                body += chunk.toString();

            });

            req.on('end', () => {

                const entry = body.split('|');

                const new_entry = `<tr><td>${entry[0]}</td><td>${entry[1]}</td><td>${entry[2]}</td></tr>`;

                entries.push(new_entry);

                if(entries.length > 10000) {

                    entries.shift();

                }

                res.statusCode = 200;

                res.setHeader('Content-Type', 'text/html');

                res.end('POST\n');

            });

            break;

        default:

            res.statusCode = 404;

            res.end('Not Found');

    }

});

server.listen(8080, () => {

    console.log('Server running at http://localhost:8080/');

});
