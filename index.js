const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const HTTP_PORT = process.env.PORT || 8080;

// Stub Variables
let acceptedFileFormats = ['png', 'jpg']; // render App on server; use config; then give to client, for now: make it match the config on client

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './feedback'),
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

// Routes
app.post('/submit-feedback', upload, (req, res) => {
    const formData = req.body;
    // TODO: make an id; then create dir and upload files
    //req.body = { id: uuidv4(), ...req.body };
    //console.log(req.body);
});

app.listen(HTTP_PORT, () => {
    console.log('Listening to ' + HTTP_PORT);
});