const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
     status:{
      type:String,
      default:'pending',
      enum:['pending' , 'accepted' , 'rejected']
     }, 
     sender : {
      type : mongoose.Types.ObjectId,
      ref:'Request',
      required:true
     }, 
     receiver : {
      type : mongoose.Types.ObjectId,
      ref:'Request',
      required:true
     },
},{
    timestamps:true
})

const Request = mongoose.models.Request ||  mongoose.model('Request',RequestSchema)
module.exports = Request