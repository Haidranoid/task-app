const PORT = process.env.PORT || 3000;
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path')
const uniqid = require('uniqid')
const sharp = require('sharp')
const express = require('express');
const app = express();

// for local storage
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        cb(null, uniqid() + path.extname(file.originalname))
    },
})
// for s3 storage
const memoryStorage = multer.memoryStorage();

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg)$/))
            return cb(new Error('File must be a jpg document.'))

        cb(null, true)
    },
    storage: memoryStorage
})

mongoose.connect('mongodb://127.0.0.1:27017/taskmanager', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, err => {
    if (err) throw err;

    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use(require('./routers/index'));

    app.post('/api/uploads', upload.single('file'), async (req, res) => {
        const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).toBuffer()
        //const destination = path.resolve('images') + '/' + `${uniqid()}${path.extname(req.file.originalname)}`
        const destination = path.resolve('images') + '/' + `${uniqid()}.png`
        fs.writeFileSync(destination, buffer);

        res.send("correct");
    }, (error, req, res, next) => {
        res.status(400).send(error.message)
    })

    app.listen(PORT, () => {
        console.log("Listening port => ", 3000);
    })
});
