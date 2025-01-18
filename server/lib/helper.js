const {userSocketIDs} = require('../app.js')

const getOtherMember = (members , userId)=>{
     return members.find((member)=> member._id.toString() !== userId.toString())
}

const getSockets = (users=[]) =>{
     console.log("in get sockets ",userSocketIDs)
     const sockets = users.map((user)=>userSocketIDs.get(user.toString()))

     return sockets 
}

module.exports = { getOtherMember , getSockets}