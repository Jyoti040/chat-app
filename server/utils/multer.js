const multer = require('multer')
//const { CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require('./cloudinary')

// const storage = new CloudinaryStorage({
//     cloudinary : cloudinary,
//     params : {
//         folder : 'chat_app',
        
//     }
// })
const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./public/temp')
    },
    filename : function(req,file,cb){
        cb(null,file.originalname)
    }
})
const upload = multer({storage : storage})

const attachmentsMulter = upload.array("files",5) // max 5 files 

module.exports = upload
module.exports =  {attachmentsMulter}