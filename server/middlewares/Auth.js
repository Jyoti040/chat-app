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
            throw new CustomAPIError("Invalid token" , 401);
        }
        req.user = user._id
        next()
        
    } catch (error) {
        
    }
}

module.exports = {verifyUser}