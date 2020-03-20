const fs = require('fs');

console.log(process.argv);
if (process.argv.length > 2) {
    const filename = process.argv[2];
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log(data);
        }
    });
} else {
    console.log('Missing argument.')
}

