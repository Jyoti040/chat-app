const express = require('express')
const router = express.Router();
const upload = require('../utils/multer')
const {registerUser , loginUser , getUserProfile , logout , searchUser, sendFriendRequest, acceptFriendRequest} = require('../controllers/user')
const {verifyUser} = require('../middlewares/Auth');
const { registerValidator, validateHandler, loginValidator, sendFriendRequestValidator, acceptFriendRequestValidator } = require('../lib/validators');

// upload.single('avatar')
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
} , registerValidator() ,validateHandler,registerUser)

router.post('/login',loginValidator(),validateHandler,loginUser)

router.use(verifyUser) // all the furrther routes must be authenticated
router.get('/my-profile',getUserProfile)
router.get('/logout',logout)
router.get('/search-user',searchUser)
router.put('/send-friend-request',sendFriendRequestValidator(),validateHandler,sendFriendRequest)
router.put('/accept-friend-request',acceptFriendRequestValidator(),validateHandler,acceptFriendRequest)

module.exports = router
