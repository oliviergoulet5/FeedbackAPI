const fs = require('fs');

export const storeData = (data, path) => {
    fs.writeFile(path, JSON.stringify(data), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Feedback submitted successfully.');
        }
    });
}

