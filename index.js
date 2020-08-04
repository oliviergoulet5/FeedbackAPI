const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const path = require('path');

const HTTP_PORT = process.env.PORT || 8080;

app.post('/submit-feedback', upload.single('feedback'), (req, res) => {
    const formData = req.body;

    console.log(formData);
})

app.listen(HTTP_PORT, () => {
    console.log('Listening to ' + HTTP_PORT);
});