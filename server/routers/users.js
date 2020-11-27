const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage()
const {authenticateToken} = require('../middleware/authentication')
const {pick, isEmpty} = require('lodash');
const User = require("./../models/User");
const router = new express.Router();

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000,
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg)$/))
            return cb(new Error('File must be an image.'))

        cb(null, true)
    },
    storage: storage
})


router.post('/api/users/me/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
    User.findOne({_id: req.user._id}, (err, user) => {
        if (err)
            return res.status(500).send(err)

        user.avatar = req.file.buffer;

        user.save((err1, userDB) => {
            if (err1)
                return res.status(500).send(err1)

            return res.status(201).json(userDB)
        })

    })
});

router.get('/api/users', authenticateToken, async (req, res) => {
    try {
        const users = await User.find({});

        return res.status(201).json(users)
    } catch (e) {
        return res.status(500).send(e.message)
    }
});

router.get('/api/users/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send('The user was not found')
        }

        return res.status(201).json(user)
    } catch (e) {
        return res.status(500).send(e.message)
    }

    /*User.findById(id, (error, user) => {
        if (error || !user) return res.status(404).send('The user was not found');

        return res.status(200).json(user)
    });*/
});

router.put('/api/users/:id', (req, res) => {
    const {id} = req.params;
    const body = pick(req.body, ['name', 'email', 'password', 'age']);

    if (isEmpty(body))
        return res.status(400).send('Empty body request');

    User.findById(id, (error, user) => {
        if (error || !user)
            return res.status(404).send('The user was not found');

        const userKeys = Object.keys(body);

        userKeys.forEach(key => {
            user[key] = body[key] || user[key];
        })

        user.save((error1, userDB) => {
                if (error1) res.status(500).send(error1.message);

                return res.status(201).json(userDB)
            }
        );
    });
});

router.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;

    User.findByIdAndRemove(id, (error, userRemoved) => {
        if (error || !userRemoved)
            return res.status(404).send('The user was not found');

        return res.status(200).json(userRemoved)
    });
});

module.exports = router;
