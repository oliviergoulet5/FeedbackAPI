const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const HTTP_PORT = process.env.PORT || 8080;

// Stub Variables
let acceptedFileFormats = ['png', 'jpg']; // render App on server; use config; then give to client, for now: make it match the config on client

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `./uploads/${req.id}`;
        fs.exists(dir, exist => {
            if (!exist) {
                return fs.mkdir(dir, error => cb(error, dir));
            }

            return cb(null, dir);
        })
    },
    filename: (req, file, cb) => {
        let timeStamp = Date.now();
        cb(null, file.fieldname + '-' + timeStamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        let extension = path.extname(file.originalname);

        if (!acceptedFileFormats.includes(extension.slice(1))) {
            return cb(new Error('File format is not allowed.'));
        }

        cb(null, true);
    }
}).single('attachments');

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));

const attachId = (req, res, next) => {
    req.id = uuidv4();
    next();
}

// Routes
app.post('/submit-feedback', attachId, upload, (req, res) => {
    const formData = req.body;
});

app.listen(HTTP_PORT, () => {
    console.log('Listening to ' + HTTP_PORT);
});