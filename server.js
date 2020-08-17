import express from 'express';
import cors from 'cors';

import { storeData } from './util';
import { attachId, upload } from './middleware';

const HTTP_PORT = process.env.PORT || 8080;
const app = express();

// Stub Variables

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));

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