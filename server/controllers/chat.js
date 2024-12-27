const CustomAPIError = require("../errors/CustomError")
const Chat = require("../models/chat")
const {emitEvent} = require("../utils/features")
const getOtherMember = require("../lib/helper")
const User = require("../models/user")
const Message = require("../models/message")

const newGroupChat = async(req,res,next)=>{
    try {
        const {groupName , members} = req.body // members have user ids

        if(members.length<2) {
            throw new CustomAPIError("A group must have atleast 3 members" , 400)
        }

        const allMembers = [...members , req.user]

        await Chat.create({
            name : groupName,
            groupChat: true , 
            creator : req.user,
            members : allMembers
        })

        emitEvent(req,'Alert',allMembers,`Welcome to ${groupName} group`)
        emitEvent(req,'Refetch chat',members,``)

        return res.status(201).json({
            success:true ,
            message : "Group created successfully"
        })
    } catch (error) {
        next(error)
    }
}

const getMyChats = async(req,res,next)=>{
 try {
    const chats = await Chat.find({members : req.user}).populate(
        "members",
        "name avatar"
    )

    const transformedChats = chats.map(({_id,name , members,groupChat })=>{
        const otherMember = getOtherMember(members,req.user)
        return {
            _id,groupChat ,
            avatar : groupChat ? (
                members.slice(0,3).map((avatar)=>avatar.url)
            ):(
                [otherMember.avatar.url]
            ),
            name : groupChat?name : otherMember.name,
            members:members.reduce((prev,curr)=>{
                if(curr._id.toString()!== req.user.toString()){
                    prev.push(curr._id)
                }
                return prev;
            },[]) // in members array we want only id of each member , empty array- initial state
        }
    }) 

    return res.status(200).json({
        success:true , 
        chats : transformedChats
    })
 } catch (error) {
    next(error)
 }
}

const getMyGroups = async(req,res,next)=>{
    try {
        const groups = await Chat.find({
            members:req.user ,
            groupChat:true,
            creator : req.user
        }).populate("members","name avatar")

        const transformedGroups = groups.map(({_id,name,groupChat,members})=>({
            _id,name,groupChat,
            avatar:members.slice(0,3).map(({avatar})=>avatar.url)
        }))

        return res.status(200).json({
            success : true ,
            groups:transformedGroups
        })
    } catch (error) {
        next(error)
    }
}

const addMembers = async(req,res,next)=>{
    try {
        const {chatId , members} = req.body
        const chat = await Chat.findById(chatId)

        if(!chat){
            throw new CustomAPIError("No chat found",404)
        }
        if(!chat.groupChat){
            throw new CustomAPIError("Not a group chat found",400)
        }

        if(chat.creator.toString() !== req.user.toString()) {
            throw new CustomAPIError("You are not allowed to add members",403)
        }

        if(!members || members.length<1){
            throw new CustomAPIError("Please provide members",400)
        }
        const allMembersPromise = members.map((member)=>User.findById(member,"name")) //fetch only name of user

        const allMembers = await Promise.all(allMembersPromise)

        const uniqueMembers = allMembers.filter((member)=>!chat.members.includes(member._id.toString())) // only unqiue members will be added

        chat.members.push(...uniqueMembers.map((i)=>i._id))

        if(chat.members.length>100){
            throw new CustomAPIError("Group members limit reached , can't add new members",400)
        }

        await chat.save()

        const allUsersName = uniqueMembers.map((member)=>member.name).join(",") // array to string of anmes sep by comma

        emitEvent(req , 'alert',chat.members,`${allUsersName} have been added to ${chat.name} by ${req.user.name}`)
        emitEvent(req,'Refetch Chats',chat.members)

        return res.status(200).json({
            success:true,
            message:"Members added successfully"
        })
    } catch (error) {
        next(error)
    }
}

const removeMember= async(req,res,next)=>{
    try {
        const {userId , chatId}= req.body

        const chat =  await Chat.findById(chatId)
        const user = await User.findById(userId,"name")

        if(!chat){
            throw new CustomAPIError("No chat found",404)
        }
        if(!chat.groupChat){
            throw new CustomAPIError("Not a group chat found",400)
        }

        if(chat.creator.toString() !== req.user.toString()) {
            throw new CustomAPIError("You are not allowed to delete members",403)
        }

        if(chat.members.length<=3){
            throw new CustomAPIError("Group must have atleast 3 members",400)
        }

        chat.members = chat.members.filter((member)=>member._id.toString() !== userId.toString()) 
        await chat.save()

        emitEvent(req,'alert',chat.members,`${user.name} is no longer part of the group`)
        emitEvent(req,'fetch chats',chat.members)

        return res.status(200).json({
            success:true ,
            message:"Member have been successfully removed"
        })
    } catch (error) {
        next(error)
    }
}

const leaveGroup = async(req,res,next)=>{
    try {
        const chatId = req.params.id
        
        const chat = await Chat.findById(chatId)

        if(!chat){
            throw new CustomAPIError("No chat found",404)
        }

        if(!chat.groupChat){
            throw new CustomAPIError("Not a group chat found",400)
        }

        const remainingMembers = chat.members.filter((member)=>member._id.toString() !== req.user.toString())

        if(remainingMembers.length<3){
            throw new CustomAPIError("Group must have atleast 3 members",400)
        }

        if(chat.creator.toString() === req.user.toString() ){
            const randomElement = Math.floor(Math.random()*remainingMembers.length)
            const newCreator = remainingMembers[randomElement]

            chat.creator = newCreator
            
        }

        chat.members = remainingMembers
        const [user] = await Promise.all([User.findById(req.user,"name") , chat.save()])

        emitEvent(req,'alert',chat.members,`${user} has left the group `)
       

        return res.status(200).json({
            success:true ,
            message:"Member left the group successfully"
        })

    } catch (error) {
        next(error)
    }
}

const sendAttachments = async(req,res,next)=>{
    try {
        const {chatId }= req.body

        const [chat , user] = await Promise.all([
            Chat.findById(chatId),
            User.findById(req.user,"name"),
        ])

        if(!chat){
            throw new CustomAPIError("No chat found",404)
        }
        
        const files = req.files || []

        if(files.length<1){
            throw new CustomAPIError("Please provide atachments",400)
        }

        const attachments = []
        const messageForRealTime ={
            content : "" , attachments ,
             sender : {
                _id: user._id,
                name : user.name,
             },
              chat : chatId
        }
        const messageForDB ={ content : "" , attachments , sender : user._id , chat : chatId}

        const message = await Message.create(messageForDB)
        emitEvent(req,"new_attachment",chat.members,{
            message:messageForRealTime,
            chatId
        })
        emitEvent(req,"new_message_alert",chat.members,{chatId})

        return res.status(200).json({
            success:true,
            message
        })
    } catch (error) {
        next(error)
    }
}

const getChatDetails = async(req,res,next)=>{
    try {
        if(req.query.populate === "true"){  //id?populate=true
           const chatId = req.params.id
           const chat = await Chat.findById(chatId).populate("members","name avatar").lean() // chat becomes now an js object , now an db obj

           if(!chat){
            throw new CustomAPIError("No chat found",404)
        }

        chat.members = chat.members.map(({_id,name,avatar})=>({
            _id,name,
            avatar : avatar.url
        }))

        return res.status(200).json({
            success:true,
            chat
        })
        }else{
            const chatId = req.params.id
            const chat = await Chat.findById(chatId)
 
            if(!chat){
             throw new CustomAPIError("No chat found",404)
            }

         return res.status(200).json({
             success:true,
             chat
         })
        }
    } catch (error) {
        next(error)
    }
}

const renameGroup = async(req,res,next)=>{
    try {
        const chatId = req.params.id
        const {name} = req.body

        const chat = await Chat.findById(chatId)

        if(!chat){
            throw new CustomAPIError("No chat found",404)
        }

        if(!chat.groupChat){
            throw new CustomAPIError("This is not a group chat , you can't rename it's name ",400)
        }

        if(chat.creator.toString() !== req.user.toString()){
            throw new CustomAPIError("You are not allowed to change the name of the group",403)
        }

        chat.name = name 
        await chat.save()

        emitEvent(req,"refetch_chats",chat.members)

        return res.status(200).json({
            success:true,
            message:"Group renamed successfully"
        })
    } catch (error) {
        next(error)
    }
}
module.exports = {
    newGroupChat , getMyChats , getMyGroups , addMembers,removeMember , leaveGroup , sendAttachments , getChatDetails,
    renameGroup
}