const express = require('express');
const path = require('path');
const {db} = require('./db/db.js');
const cityController = require('./controllers/cityController')
const server = express();

server.use(express.static(path.join(__dirname, 'public')));

server.use((req, res, next) => {
    console.log('Request : ' + req.path);
    next();
})

server.use(cityController);

const port = 3000;

db.once('open', () => {
    console.log('connection MONGODB succeded.');
    const serverListener = server.listen(port, () => {
        console.log(`Server running at port ${port}`)
    });
    process.on('SIGTERM', shutDown);
    process.on('SIGINT', shutDown);

    function shutDown() {
        serverListener.close(() => {
            console.log(`Server closed at port ${port}`);
        });
        db.close(() => {
            console.log(`DB closed`);
        });
    }
});
