const express = require('express');
const {authenticateToken} = require('../middleware/authentication')
const {pick, isEmpty} = require('lodash');
const User = require("./../models/User");
const router = new express.Router();

router.post('/api/auth/login', async (req, res) => {
    const body = pick(req.body, ['email', 'password']);

    if (isEmpty(body))
        return res.status(400).send('Empty body request');

    if (!body.email || !body.password)
        return res.status(400).send('Error in body request');

    try {
        const userDB = await User.findByCredentials(body.email, body.password);
        console.log(1)
        const token = await userDB.generateAuthToken();
        console.log(2)
        return res.status(200).json({userDB, token});
    } catch (e) {
        return res.status(404).send(e.message)
    }
});

router.post('/api/auth/logout', authenticateToken, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        console.log(req.user);
        await req.user.save();
        res.send()
    } catch (e) {
        return res.status(500).send()
    }
});

module.exports = router;
