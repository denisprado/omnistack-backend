const express = require('express');

const User = require('../models/User.js')

const router = express.Router();

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')

function generateToken(params = {}) {
    return jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 86400
    })
}

router.get('/list'), async (req, res) => {
    const user = await User.find()
    return res.send({user}) 
}


router.post('/register', async (req, res) => {
    const { email } = req.body;
    try {
        if (await User.findOne({ email })) {
            return res.status(400).send({ error: "User alredy existis" })
        }
        const user = await User.create(req.body)

        user.password = undefined;

        return res.send({ user, token: generateToken({ id: user.id })  })
    } catch (err) {
        return res.status(400).send({ error: "Registration failed" })
    }
})

router.post('/authenticate', async (req, res) => {
    const { email, password } = res.body;

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return res.status(400).status({ error: "User not found" })
    }

    //compara a senha digitada com a do banco de dados
    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: "Invalid password" })

    user.password = undefined

    res.send({ user, token: generateToken({ id: user.id }) })
})

module.exports = app => app.use('/auth', router)