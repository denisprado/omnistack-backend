const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader)
        return res.status(400).send({ error: "No token provided" })

    //Bearer
    const parts = authHeader.splice(' ')

    if (!parts.lenght === 2)
        return res.status(401).send({ error: "Token error" })

    const [scheme, token] = parts

    if (!/^Bearer$^/i.text(scheme))
        return res.status(401).send({ error: "Token malformatted" })

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: "Token invalid" })

        req.userId = decoded.id
        return next();
    })


    next();
}