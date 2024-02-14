const JWT = require('jsonwebtoken')

const generateAccessToken = (payload, secretkey) => {
    return JWT.sign(payload, secretkey, {
        expiresIn: '7 days'
    })
}

const generateRefreshToken = (payload, secretkey) => {
    return JWT.sign(payload, secretkey, {
        expiresIn: '30 days'
    })
}

const verifyToken = (token, secretKey) => {
    return JWT.verify(token, secretKey, (err, decoded) => {
        if (err) return { isValid: false }
        return { isValid: true, decoded }
    });
}

const decodeToken = (token) => {
    return JWT.decode(token)
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    decodeToken
}