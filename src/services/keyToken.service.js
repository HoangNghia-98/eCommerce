const keyTokenModel = require('../models/keytoken.model')

class KeyTokenService {

    static saveKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            const tokens = await keyTokenModel.create({
                user: userId,
                publicKey,
                privateKey
            })

            return tokens || null
        } catch (error) {
            console.error('saveKeyToken::error::', error)
            throw error;
        }
    }
}

module.exports = KeyTokenService