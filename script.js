const fs = require('fs');
const http = require('http');
const pug =  require('pug');

const compileTemplate = pug.compileFile('index.pug');

const readFile_ = function readFile_(filename, cb) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error(err.message);
            cb(null, err);
        } else {
            cb(data, null);
        }
    });
}


const server = http.createServer((req, res) => {
    console.log('requete recu');

    console.log(req.url);

    const params = req.url.split('?');
    let filename = '';
    if (params.length > 1) {
        const param = params.pop().split('=');
        if (param.length > 1 && param[0] === 'filename') {
            filename = param[1];
        } else {
            res.statusCode = 300;
            res.setHeader("Content-Type", "text/plain");
            res.end('Wrong parameter');
            return;
        }
    } else {
        console.log('No parameter')
        res.statusCode = 300;
        res.setHeader("Content-Type", "text/plain");
        res.end('No parameter');
        return;
    }
    readFile_(filename, (data, err) => {
        console.log(err);
        if (err) {
            console.error(err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "text/plain");
            res.end(err.message);
            return;
        }

        const file = data.split(`\n`).map(value => value.split(';'));

        const genTemplate = compileTemplate({
            file: file
        });
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(genTemplate);
    });
});

const port = 3000;

server.listen(port, () => {
    console.log(`Server running at port ${port}`)
});





