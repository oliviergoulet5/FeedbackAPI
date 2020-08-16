import express from 'express';
const app = express();
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
const { v4: uuidv4 } = require('uuid');

import { storeData } from './util';

const HTTP_PORT = process.env.PORT || 8080;

// Stub Variables
let acceptedFileFormats = /png|jpg/;

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

        if (!acceptedFileFormats.test(extension)) {
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
    
    // Save form data to JSON file
    storeData(formData, `./uploads/${req.id}/form.json`);
});

app.listen(HTTP_PORT, () => {
    console.log('Listening to ' + HTTP_PORT);
});

// Todo: Server-side rendering
// https://www.digitalocean.com/community/tutorials/react-server-side-rendering