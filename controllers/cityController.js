const fs = require('fs');
const pug =  require('pug');
const express = require('express');
const path = require('path');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const {City} = require('../db/db.js');
const mongoose = require('mongoose');

const cityController = express();

const CITIES_PATH = 'cities.json';
const MY_NAMESPACE = 'fdda765f-d989-321c-ad06-52a7df8164ec';

const compileTemplate = pug.compileFile('web/index.pug');

const jsonParser = bodyParser.json();

const urlEncoded = bodyParser.urlencoded({extended: true});


cityController.get('/cities', function(req, res) {
    City.find({}, (err, docs) => {
        if (err) {
            res.set('Content-Type', 'text/plain');
            res.status(500).send('File does not exist');
            return;
        }
        res.set('Content-Type', 'application/json');
        res.status(200).send(docs);
    });
    
});

cityController.post('/city', jsonParser, urlEncoded, (req, res) => {

    const name = req.body.name;
    console.log(req.body);

    if (name === undefined) {
        res.set('Content-Type', 'text/plain');
        res.status(500).send('Invalid Parameter');
        return;
    }
    City.find({name: name}, (err, docs) => {
        if (err) {
            res.set('Content-Type', 'text/plain');
            res.status(500).send('DB error');
            return;
        }
        if (docs.length === 0) {
            const city = new City({name: name});
            city.save((err) => {
                if (err) {
                    res.set('Content-Type', 'text/plain');
                    res.status(500).send('DB error');
                    return;
                }
                res.set('Content-Type', 'text/plain');
                res.status(200).send('ok');
                return;
            });
        } else {
            res.set('Content-Type', 'text/plain');
            res.status(400).send('Cette ville existe deja;');
            return;
        }
    });
});

cityController.put('/city/:id', jsonParser, urlEncoded, (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    if (id === undefined) {
        id = req.body.id;
    }
    if (name === undefined || id === undefined) {
        res.set('Content-Type', 'text/plain');
        res.status(500).send('Invalid Parameter');
        return;
    }
    console.log(id);


    City.findById(id, (err, doc) => {
        if (err) {
            res.set('Content-Type', 'text/plain');
            res.status(500).send('DB error');
            return;
        }
        console.log(doc);
        if (doc) {
            doc.name = name;
            doc.save((err) => {
                if (err) {
                    res.set('Content-Type', 'text/plain');
                    res.status(500).send('DB error');
                    return;
                }
                res.set('Content-Type', 'text/plain');
                res.status(200).send('ok');
                return;
            });
        } else {
            res.set('Content-Type', 'text/plain');
            res.status(400).send('Cette ville n\'existe pas');
            return;
        }
    });
});

cityController.delete('/city/:id', (req, res) => {
    const id = req.params.id;

    if (id === undefined) {
        res.set('Content-Type', 'text/plain');
        res.status(500).send('Invalid Parameter');
        return;
    }

    City.findById(id, (err, doc) => {
        if (err) {
            res.set('Content-Type', 'text/plain');
            res.status(500).send('DB error');
            return;
        }
        if (doc) {
            City.deleteOne({_id: doc._id}, (err) => {
                if (err) {
                    res.set('Content-Type', 'text/plain');
                    res.status(500).send('DB error');
                    return;
                }
                res.set('Content-Type', 'text/plain');
                res.status(200).send('ok');
                return;
            });
        } else {
            res.set('Content-Type', 'text/plain');
            res.status(400).send('Cette ville n\'existe deja;');
            return;
        }
        
    });
});

cityController.get('/', function(req, res) {
    City.find({}, (err, docs) => {
        if (err) {
            res.set('Content-Type', 'text/plain');
            res.status(500).send('DB error');
            return;
        }
        
        const genTemplate = compileTemplate({
            cities: docs
        });
        res.set('Content-Type', 'text/html');
        res.status(200).send(genTemplate);
    });
});

const compileAddCity = pug.compileFile('web/addCity.pug');

cityController.get('/addCity', (req, res) => {
    const genTemplate = compileAddCity();
    res.set('Content-Type', 'text/html');
    res.status(200).send(genTemplate);
});


const compileModifyCity = pug.compileFile('web/modifyCity.pug');

cityController.get('/modifyCity/:id', (req, res) => {
    const id = req.params.id;
    if (id === undefined) {
        res.set('Content-Type', 'text/plain');
        res.status(500).send('Invalid Parameter');
        return;
    }
    City.findById(id, (err, doc) => {
        if (err) {
            res.set('Content-Type', 'text/plain');
            res.status(500).send('DB error');
            return;
        }

        const genTemplate = compileModifyCity({
            city: doc
        });
        res.set('Content-Type', 'text/html');
        res.status(200).send(genTemplate);
    });
});

module.exports = cityController;