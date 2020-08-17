import path from 'path';
import fs from 'fs';
import multer from 'multer';
const { v4: uuidv4 } = require('uuid');

let acceptedFileFormats = /png|jpg/;

export const attachId = (req, res, next) => {
    req.id = uuidv4();
    next();
}

// Multer
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

export const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        let extension = path.extname(file.originalname);

        if (!acceptedFileFormats.test(extension)) {
            return cb(new Error('File format is not allowed.'));
        }

        cb(null, true);
    }
}).single('attachments');