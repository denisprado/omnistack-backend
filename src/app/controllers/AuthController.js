const express = require('express');

const User = require('../models/User.js')

const router = express.Router();

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    })
}

router.get('/list', function (req, res) {
    User.find({}, function (err, users) {
        var userMap = {};

        users.forEach(function (user) {
            userMap[user._id] = { user };
        });

        res.send({ userMap });
    }).select('+password');
});


router.post('/register', async (req, res) => {
    const { email } = req.body;
    try {
        if (await User.findOne({ email }))
            return res.status(400).send({ error: "User alredy existis" })

        const user = await User.create(req.body)

        user.password = undefined;

        return res.send({ 
            user, 
            token: generateToken({ id: user.id }) })
    } catch (err) {
        return res.status(400).send({ error: "Registration failed" })
    }
})

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password')

    if (!user)
        return res.status(400).send({ error: "User not found" });


    //compara a senha digitada com a do banco de dados
    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: "Invalid password" })

    user.password = undefined

    res.send({ user, token: generateToken({ id: user.id }) })
})

module.exports = app => app.use('/auth', router)