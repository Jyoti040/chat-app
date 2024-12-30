require('dotenv').config({
    path:'./.env'
})
const express = require('express')
const { Server } = require("socket.io")
const { createServer } = require("http")

const app=express()
const server = createServer(app)
const io = new Server(server,{})

const connectDB = require('./db/connect')
const cookieParser = require('cookie-parser')
const {v4} = require("uuid")

const CustomError = require('./errors/CustomError')
const NotFoundMiddleware = require('./middlewares/NotFound.js')
const ErrorHandlerMiddleware = require('./middlewares/ErrorHandler.js')

const userRoutes = require('./routes/user')
const chatRoutes = require('./routes/chat')
const { getSockets } = require('./lib/helper.js')
const Message = require('./models/message.js')

app.use(express.json()) // access json data sent in req.body
app.use(cookieParser())

app.use('api/v1/user',userRoutes)
app.use('api/v1/chat',chatRoutes)

app.get('/',(req,res)=>{
      res.send('Welcome to chat app')
})

const userSocketIDs = new Map()  // all members currently connected to socket 

io.use((socket , next )=>{

})

io.on("connection",(socket)=>{
    const user ={  // random for now
        _id:"123455",
        name:"test"
    }
    console.log("user connected ",socket.id)
    userSocketIDs.set(user._id.toString() , socket.id)

    socket.on("NEW_MESSAGE",async ({chatId , members , message})=>{  // emit emiited from frontend / client , to which server are listening here
       const messageForRealTime = {
        content:message,
        _id:uuid(),
        sender : user,
        chat : chatId,
        createdAt: new Date().toISOString()
       }

       const messageForDB = {
        content:message , 
        chat : chatId,
        sender:user._id
       }
        
       const memberSockets = getSockets(members)
       
       io.to(memberSockets).emit("NEW_MESSAGE",{
        message:messageForRealTime,
        chatId
       })// emit emiited from server , to which server will listen

       io.to(memberSockets).emit("NEW_MESSAGE_ALERT",{
        chatId
       })

       await Message.create(messageForDB)
       console.log("New message ",messageForRealTime)
    })

    socket.on("disconnect",()=>{
        userSocketIDs.delete(user._id.toString())
        console.log("user disconnected")
    })
})

app.use(ErrorHandlerMiddleware)
app.use(NotFoundMiddleware)

const port = process.env.PORT || 3000
const mongoURI = process.env.MONGO_URI
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION"

const start = async () => {
    try {
        await connectDB(mongoURI)
        console.log('Connected to database')
        server.listen(
            port , ()=>{ console.log(`Server is listening to port - ${port} in ${envMode} mode`)}
        )
      //  console.log(`Server is listening to port - ${port} in ${envMode} mode `)
    } catch (error) {
        console.log('An error occured while connecting to database ', error)
    }
}

start()

module.exports = { envMode , userSocketIDs }