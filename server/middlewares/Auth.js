const CustomAPIError = require('../errors/CustomError')
const User = require('../models/user')
const jwt =require("jsonwebtoken")

const verifyUser = async(req,res,next)=>{
    try {
        console.log('in verify user ',req.cookies)
        const token = req.cookies?.authToken

        if(!token){
            throw new CustomAPIError("Please login first to access this route" , 401);
        }

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET)

        const user = await User.findById(decodedToken?.ID)
        if(!user){
            throw new CustomAPIError("No user found with given token" , 401);
        }
        req.user = user._id
        next()
        
    } catch (error) {
        
    }
}

const socketAuthenticator =async (err,socket,next)=>{
    try {
        if(err) return next(err)
        
        const authToken = socket.request.cookies.authToken 
        if(!authToken){
            throw new CustomAPIError("Please login first to access this route" , 401);
        }

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(decodedToken?.ID)
        if(!user){
            throw new CustomAPIError("No user found with given token" , 401);
        }
        socket.user = user

        return next()

    } catch (error) {
        throw new CustomAPIError("Please login first to access this route" , 401);
    }
}

module.exports = {verifyUser , socketAuthenticator}