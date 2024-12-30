 const {cloudinary} = require('./cloudinary')
const emitEvent = (req,event,users,data)=>{
        console.log("emitting event " , event)
}

const uploadToCloudinary = async(req,res,next)=>{
       try {
        const result = await cloudinary.uploader.upload(req.file.path)
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