const CustomAPIError = require('../errors/CustomError')
const User = require('../models/user')
const cookieOptions = require("../constants/constants")

const createUserToken = async(ID , next) =>{
        try {
            const user = await User.findById(ID)
            console.log('in create token ',user)
            if(!user){
                throw new CustomAPIError("Invalid user id ",404)
            }

            const token = user.generateJWTToken()
            if(!token){
                throw new CustomAPIError("Error while generating user token ",500)
            }
            user.token = token
            await user.save({validateBeforeSave : false})
            return token 

        } catch (error) {
            next(token)
        }   
}

const registerUser = async(req,res,next)=>{   
  try {
     const {name , userName , userEmail, password , bio  } = req.body

    //  if([name, userName , userEmail , password , bio ].some((field)=>field?.trim()==="")){
    //     throw new CustomAPIError('Please provide all the details',400)
    // }

    const user = await User.findOne({
        $or :[ {userName , userEmail} ]
    })

    if(user){
         throw new CustomAPIError('User already exists , please register with unique credentials' , 409)   
    } 

    console.log('after user error')

    const newUser = await User.create({
        userName, userEmail, password ,name , bio , avatar
    })

    const createdUser = await User.findById(newUser._id)

    if(!createdUser){
       throw new CustomAPIError("Somehthing went wrong while registering user")
   }

   const token = await createUserToken(createdUser._id) 

//    const options = {
//     maxAge:15*24*60*60*1000, // 15 days
//     sameSite:"none",
//     httpOnly : true ,
//     secure : true ,
//   }

   return res.status(201)
   .cookie("authToken",token,cookieOptions)
     .json({
        success:true,
         message : 'User registerd successfully' ,
         createdUser
     })

  } catch (error) {
    next(error)
  }
}

const loginUser = async(req,res,next)=>{
     try {
        const {userEmail, password} = req.body

        if(!userEmail ) {
            throw new CustomAPIError('Please provide an email ',400) // bad req status code
        }
        if(!password ) {
            throw new CustomAPIError('Please provide the password ',400)  
        }

        const user = await User.findOne({userEmail}).select("+password")
        if(!user){
            throw new CustomAPIError('No such email is registered , please create an account first',404)
        }

        const isPasswordCorrect = await user.comparePassword(password)
        if(!isPasswordCorrect){
            throw new CustomAPIError('Incorrect password',401) 
        }

        const token = await generateUserToken(user._id)
        const loggedInUser = await User.findById(user._id)
  
        const options = {
          httpOnly : true ,
          secure : true ,
        }
  
        return res.status(200)
        .cookie("authToken",token,options)
        .json({


             success:true,
             user : loggedInUser ,
            message : 'User logged in successfully'
        })
        
     } catch (error) {
        next(error)
     }
}

const getUserProfile = async(req,res,next)=>{
    try {
        return res.status(200).json({
            success:true,
            user:req.user
        })
    } catch (error) {
        next(error)
    }
}

const logout = async(req,res,next)=>{
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset : {
                    token : ""
                }
            },{
                new : true
            }
        )

        return res.status(200)
      .clearCookie("authToken",{
        ...cookieOptions , maxAge:0
      })
      .json({
        success:true,
        message : 'logged out successfully'
      })   
    } catch (error) {
        next(error)
    }
}

const searchUser = async(req,res,next)=>{
    try {
      
    } catch (error) {
        next(error)
    }
}

module.exports = {registerUser , loginUser , getUserProfile , logout , searchUser}