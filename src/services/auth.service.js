const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('../services/keyToken.service')
const { generateAccessToken, generateRefreshToken } = require('../auth/jwt')
const { getInfoData } = require('../utils')
const { Api403Error } = require('../core/error.response')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: '001',
    READ: '002',
    DELETE: '003',
    ADMIN: '000'
}

class AuthService {
    signUp = async ({ name, email, password }) => {
        // step1: check email exists?
        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new Api403Error('Error: Shop already registered')
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        // create new shop success
        if (newShop) {
            // create privateKey, publicKey
            const publicKey = crypto.randomBytes(64).toString('hex')
            const privateKey = crypto.randomBytes(64).toString('hex')

            // save privateKey, publiKey to db
            const keySaved = await KeyTokenService.saveKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
            })

            if (!keySaved) {
                throw new BusinessLogicError('Error: Saving public key & private key erro')
            }

            // created access token & refresh token
            const payload = {
                userId: newShop._id,
                email
            }

            const accessToken = generateAccessToken(payload, publicKey)
            const refreshToken = generateRefreshToken(payload, privateKey)
            console.log('Created tokens success:: ', { accessToken, refreshToken })

            return {
                code: 201,
                metaData: {
                    shop: getInfoData({
                        fields: ['_id', 'name', 'email'],
                        object: newShop
                    }),
                    accessToken,
                    refreshToken
                }
            }

        }

        throw new BusinessLogicError('Error: server error cannot signup')
    }
}

module.exports = new AuthService()