const fs = require('fs');
const pug =  require('pug');
const express = require('express');
const path = require('path');
const uuid = require('uuid');
const bodyParser = require('body-parser');

const server = express();

const CITIES_PATH = 'cities.json';
const MY_NAMESPACE = 'fdda765f-d989-321c-ad06-52a7df8164ec';

const compileTemplate = pug.compileFile('index.pug');

const jsonParser = bodyParser.json();

server.use(express.static(path.join(__dirname, 'public')));

server.use((req, res, next) => {
    console.log('Request : ' + req.path);
    next();
})

server.get('/cities', function(req, res) {
    fs.exists(CITIES_PATH, (data) => {
        if (!data) {
            res.set('Content-Type', 'text/plain');
            res.status(500).send('File does not exist');
            return;
        }
        fs.readFile(CITIES_PATH, 'utf8', (err, data) => {
            if (err) {
                console.error(err.message);
                res.set('Content-Type', 'text/plain');
                res.status(500).send(err.message);
                return;
            }
    
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        });
    });
    
});

server.post('/city', jsonParser, (req, res) => {

    const name = req.body.name;

    if (name === undefined) {
        res.set('Content-Type', 'text/plain');
        res.status(500).send('Invalid Parameter');
        return;
    }
    fs.exists(CITIES_PATH, (data) => {
        if (!data) {
            const cities = {
                cities: [
                    {id: uuid.v5(name, MY_NAMESPACE), name: name}
                ]
            };
            fs.writeFile(CITIES_PATH, JSON.stringify(cities), (err) => {
                if (err) {
                    res.set('Content-Type', 'text/plain');
                    res.status(500).send(err.message);
                    return;
                }
                res.set('Content-Type', 'text/plain');
                res.status(200).send('ok');
            });
        } else {
            fs.readFile(CITIES_PATH, 'utf8', (err, data) => {
                if (err) {
                    res.set('Content-Type', 'text/plain');
                    res.status(500).send(err.message);
                    return;
                }

                const root = JSON.parse(data);

                if (root.cities.includes(value => value.name === name)) {
                    res.set('Content-Type', 'text/plain');
                    res.status(500).send(err.message);
                    return;
                }

                root.cities.push({id: uuid.v5(name, MY_NAMESPACE), name: name});

                fs.writeFile(CITIES_PATH, JSON.stringify(root), (err) => {
                    if (err) {
                        res.set('Content-Type', 'text/plain');
                        res.status(500).send(err.message);
                        return;
                    }
                    res.set('Content-Type', 'text/plain');
                    res.status(200).send('ok');
                });
            });
        }
    });
});

server.put('/city/:id', jsonParser, (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    fs.exists(CITIES_PATH, (data) => {
        if (!data) {
            res.set('Content-Type', 'text/plain');
            res.status(500).send('no file');
            return;
        } else {
            fs.readFile(CITIES_PATH, 'utf8', (err, data) => {
                if (err) {
                    res.set('Content-Type', 'text/plain');
                    res.status(500).send(err.message);
                    return;
                }

                const root = JSON.parse(data);

                const city = root.cities.find(value => value.id === id)
                if (city !== undefined) {
                    root.cities.find(value => value.id === id).name = name;

                    fs.writeFile(CITIES_PATH, JSON.stringify(root), (err) => {
                        if (err) {
                            res.set('Content-Type', 'text/plain');
                            res.status(500).send(err.message);
                            return;
                        }
                        res.set('Content-Type', 'text/plain');
                        res.status(200).send('ok');
                    });
                } else {
                    res.set('Content-Type', 'text/plain');
                    res.status(500).send('No id');
                    return;
                }
            });
        }
    });
});

server.delete('/city/:id', (req, res) => {
    const id = req.params.id;
    fs.exists(CITIES_PATH, (data) => {
        if (!data) {
            res.set('Content-Type', 'text/plain');
            res.status(500).send('no file');
            return;
        } else {
            fs.readFile(CITIES_PATH, 'utf8', (err, data) => {
                if (err) {
                    res.set('Content-Type', 'text/plain');
                    res.status(500).send(err.message);
                    return;
                }

                const root = JSON.parse(data);

                const city = root.cities.find(value => value.id === id)
                if (city !== undefined) {
                    root.cities = root.cities.filter(value => value.id !== id);

                    fs.writeFile(CITIES_PATH, JSON.stringify(root), (err) => {
                        if (err) {
                            res.set('Content-Type', 'text/plain');
                            res.status(500).send(err.message);
                            return;
                        }
                        res.set('Content-Type', 'text/plain');
                        res.status(200).send('ok');
                    });
                } else {
                    res.set('Content-Type', 'text/plain');
                    res.status(500).send('No id');
                    return;
                }
            });
        }
    });
});

server.get('/', function(req, res) {
    const filename = req.query.filename;
    if (filename === undefined) {
        res.set('Content-Type', 'text/plain');
        res.status(500).send('Invalid Parameter');
        return;
    }
    fs.readFile(CITIES_PATH, 'utf8', (err, data) => {
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

const serverListener = server.listen(port, () => {
    console.log(`Server running at port ${port}`)
});

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
    serverListener.close(() => {
        console.log(`Server closed at port ${port}`)
    });
}
