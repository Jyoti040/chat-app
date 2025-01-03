 const CustomAPIError = require('../errors/CustomError')
const {cloudinary} = require('./cloudinary')
const {v4 } = require("uuid")

const emitEvent = (req,event,users,data)=>{
        console.log("emitting event " , event)
}

const uploadToCloudinary = async(req,res,next)=>{
       try {
        if(!req.file){
                throw new CustomAPIError("Please upload an avatar",400)
        }
        const result = await cloudinary.uploader.upload(req.file.path,{
                resource_type:"auto",
                public_id:v4()
        })
        req.avatar={
         public_id : result.public_id,
         url:result.secure_url
        }
         next()
       } catch (error) {
        next(error)
       }
}
const deleteFilesFromCloudinary = async(public_ids)=>{

}

module.exports = {emitEvent , deleteFilesFromCloudinary , uploadToCloudinary}