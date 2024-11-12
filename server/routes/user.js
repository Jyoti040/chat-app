const express = require('express')
const router = express.Router();
const upload = require('../utils/multer')
const {registerUser , loginUser} = require('../controllers/user')

router.post('/register',upload.single('profilePicture'),async (req,res,next)=>{
    try {
        console.log('in image upload ',req.file.path)
        const profilePicture = req.file.path
        req.body.profilePicture = profilePicture;
        console.log('after file uplaod', profilePicture)
        next()
    } catch (error) {
        next(error)
    }
} , registerUser)
router.post('/login',loginUser)

module.exports = router
