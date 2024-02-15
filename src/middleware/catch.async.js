// make a safe function with a HOF
const catchAsync = (asyncFunc) => {
    // return a express middleware 
    // to wrapper asyncFunc middleware & catch async error
    return (req, res, next) => {
        asyncFunc(req, res, next).catch(error => next(error))
    }
}

module.exports = {
    catchAsync
}