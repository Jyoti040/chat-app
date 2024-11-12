const User = require('../models/user')

const registerUser = async(req,res)=>{   // look for profile pic - eco engage only have type string , here diff
  try {
     const {name , userName , userEmail, password , bio } = req.body

     if([name, userName , userEmail , password , bio ].some((field)=>field?.trim()==="")){
        throw new CustomAPIError('Please provide all the details',400)
    }

    const user = await User.findOne({
        $or :[ {userName , userEmail} ]
    })

    if(user){
         throw new CustomAPIError('User already exists , please register with unique credentials' , 409)   
    } 

    console.log('after user error')

    const newUser = await User.create({
        userName, userEmail, password ,name , bio
    })

    const createdUser = await User.findById(newUser._id)

    if(!createdUser){
       throw new CustomAPIError("Somehthing went wrong while registering user")
   }

   return res.status(201)
     .json({
         message : 'User registerd successfully' ,
         createdUser
     })

  } catch (error) {
    
  }
}

const loginUser = (req,res)=>{

}

module.exports = {registerUser , loginUser}