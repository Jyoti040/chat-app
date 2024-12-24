const express = require('express')
const router = express.Router();
const upload = require('../utils/multer')
const {registerUser , loginUser} = require('../controllers/user')

router.post('/register',upload.single('avatar'),async (req,res,next)=>{
    try {
        console.log('in image upload ',req.file.path)
        const avatar = req.file.path
        req.body.avatar = avatar;
        console.log('after file uplaod', avatar)
        next()
    } catch (error) {
        next(error)
    }
} , registerUser)
router.post('/login',loginUser)



module.exports = router
