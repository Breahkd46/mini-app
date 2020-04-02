const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/mini_tp", {useNewUrlParser: true});

const db = mongoose.connection;

const citySchema = new mongoose.Schema({
    name: String
})

const City = new mongoose.model('Cities', citySchema);

db.once('error', console.error.bind(console, 'connection error: '));

module.exports = {
    db,
    City
};