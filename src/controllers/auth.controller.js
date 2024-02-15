const AuthService = require('../services/auth.service')
const { catchAsync } = require('../middleware/catch.async')
const { CREATED } = require('../core/success.response')

class AuthController {
    signUp = catchAsync(async (req, res, next) => {
        CREATED(res, "Register success", await AuthService.signUp(req.body))
    })
}

module.exports = new AuthController()