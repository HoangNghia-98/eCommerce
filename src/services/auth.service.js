const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('../services/keyToken.service')
const { generateAccessToken, generateRefreshToken } = require('../auth/jwt')
const { getInfoData } = require('../utils')
const { Api403Error, BusinessLogicError } = require('../core/error.response')
const shopModel = require('../models/shop.model')
const apiKeyModel = require('../models/apikey.model')
const { findByEmail } = require('./shop.service')

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
            // created access token & refresh token
            const payload = {
                userId: newShop._id,
                email
            }
            const accessToken = generateAccessToken(payload, publicKey)
            const refreshToken = generateRefreshToken(payload, privateKey)

            // save privateKey, publiKey to db
            await KeyTokenService.saveKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
                refreshToken
            })

            // generate & save apiKey to db
            const apiKey = new apiKeyModel({
                key: crypto.randomBytes(64).toString('hex'),
                permissions: ['0000']
            })
            await apiKey.save()

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

    /**
     * 1 - Check email in dbs
     * 2 - Match password
     * 3 - Create AT vs RT and save
     * 4 - Generate tokens
     * 5 - Get data return login
     *
     * @param email
     * @param password
     * @returns {Promise<void>}
     */
    singIn = async ({ email, password }) => {
        // 1.
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new Api403Error('Shop is not registered')

        // 2.
        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new BusinessLogicError('Login error')

        // 3. create private key, public key
        const publicKey = crypto.randomBytes(64).toString('hex')
        const privateKey = crypto.randomBytes(64).toString('hex')
        const payload = {
            userId: foundShop._id,
            email
        }
        const accessToken = generateAccessToken(payload, publicKey)
        const refreshToken = generateRefreshToken(payload, privateKey)

        await KeyTokenService.saveKeyToken({
            userId: foundShop._id,
            privateKey,
            publicKey,
            refreshToken,
        })

        //
        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop
            }),
            accessToken,
            refreshToken
        }
    }
}

module.exports = new AuthService()