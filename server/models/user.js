const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
       name : {
        type:String,
        required : [true , 'Name is required'],
       },
       userName : {
        required : [true , 'User name is required'],
        lowercase : true ,
        trim : true,
        unique:  [true , 'User name already exists'],
       },
     userEmail : {
        type : String ,
        required : [true , 'User email is required'],
        lowercase : true ,
        trim : true,
        unique : [true,'Email already registered  '],
        match : [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
       , 'Enter a valid email'
     ]
    },
       password : {
        type:String,
        required:[true , 'Password is required'],
        select : false   // everytime data is metched from model , password is not there in the data field
       },
       bio:{
        type:String,
       },
       avatar : {
         public_id:{
            type:String,
        required:true
         },
         url:{
            type:String,
        required:true
         },
       },
       token:{
        type: String,
       }
},{
    timestamps:true
})

const User = mongoose.models.User ||  mongoose.model('User',userSchema)

userSchema.pre('save',async function(next){
    if(!this.isModified("password")){
        return next()
    }
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password , salt)
   next()
})

userSchema.methods.generateJWTToken = function(){
  return jwt.sign({
    ID:this.id,
    userName:this.userName,
  },
  process.env.JWT_SECRET,
  {
    expiresIn : process.env.JWT_LIFETIME
  }
)
}

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password , this.password);
}

module.exports = User