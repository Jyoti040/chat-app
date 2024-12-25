const express = require('express')
const router = express.Router();
const {newGroupChat , getMyChats, getMyGroups , addMembers, removeMember, leaveGroup} = require('../controllers/chat')
const {verifyUser} = require('../middlewares/Auth')

router.use(verifyUser) // all the furrther routes must be authenticated

router.post("/new",newGroupChat)
router.get("/my-chats",getMyChats);
router.get("/my-groups",getMyGroups);
router.put("/add-members",addMembers)
router.put("/remove-member",removeMember)

router.delete("/leave/:id",leaveGroup)

module.exports = router
