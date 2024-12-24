const CustomAPIError = require('../errors/CustomError')

const ErrorHandler = (err,req,res,next)=>{

    if(err.code===11000){
        err.message = "Duplicate email"
    }

    const statusCode = err.statusCode || 500 
    const message = err.message || 'Something went wrong , please try again later'

    return res.status(statusCode).json({message})
    
}

module.exports = ErrorHandler