const AuthService = require('../services/auth.service')
const { catchAsync } = require('../middleware/catch.async')
const { CREATED, OK } = require('../core/success.response')

class AuthController {
    signUp = catchAsync(async (req, res) => {
        CREATED(res, "Register success", await AuthService.signUp(req.body))
    })

    signIn = catchAsync(async (req, res) => {
        OK(res, "Login success", await AuthService.singIn(req.body))
    })
}

module.exports = new AuthController()