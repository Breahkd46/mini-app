const fs = require('fs');

fs.readFile('data.csv', 'utf8', (err, data) => {
    console.log(data);
});