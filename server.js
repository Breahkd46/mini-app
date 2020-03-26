const fs = require('fs');
const pug =  require('pug');
const express = require('express');
const path = require('path');

const server = express();

server.use(express.static(path.join(__dirname, 'public')));

const compileTemplate = pug.compileFile('index.pug');

const readFile_ = function readFile_(filename, cb) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            cb(null, err);
        } else {
            cb(data, null);
        }
    });
}

server.get('/', function(req, res) {
    const filename = req.query.filename;
    if (filename === undefined) {
        res.set('Content-Type', 'text/plain');
        res.status(500).send('Invalid Parameter');
        return;
    }
    readFile_(filename, (data, err) => {
        if (err) {
            console.error(err.message);
            res.set('Content-Type', 'text/plain');
            res.status(500).send(err.message);
            return;
        }
        const file = data.split(`\n`).map(value => value.split(';'));

        const genTemplate = compileTemplate({
            file: file
        });
        res.set('Content-Type', 'text/html');
        res.status(200).send(genTemplate);
    });
})

const port = 3000;

server.listen(port, () => {
    console.log(`Server running at port ${port}`)
});





