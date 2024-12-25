const express = require('express')
const router = express.Router();
const upload = require('../utils/multer')
const {registerUser , loginUser , getUserProfile , logout , searchUser} = require('../controllers/user')
const {verifyUser} = require('../middlewares/Auth')

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

router.use(verifyUser) // all the furrther routes must be authenticated
router.get('/my-profile',getUserProfile)
router.get('/logout',logout)
router.get('/search-user',searchUser)

module.exports = router
