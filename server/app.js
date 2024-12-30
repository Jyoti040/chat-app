require('dotenv').config({
    path:'./.env'
})
const express = require('express')
const app=express()

const connectDB = require('./db/connect')
const cookieParser = require('cookie-parser')

const CustomError = require('./errors/CustomError')
const NotFoundMiddleware = require('./middlewares/NotFound.js')
const ErrorHandlerMiddleware = require('./middlewares/ErrorHandler.js')


const userRoutes = require('./routes/user')
const chatRoutes = require('./routes/chat')

app.use(express.json()) // access json data sent in req.body
app.use(cookieParser())

app.use('api/v1/user',userRoutes)
app.use('api/v1/chat',chatRoutes)

app.get('/',(req,res)=>{
      res.send('Welcome to chat app')
})

app.use(ErrorHandlerMiddleware)
app.use(NotFoundMiddleware)

const port = process.env.PORT || 3000


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log('Connected to database')
        console.log(`Server is listening to port - ${port} `)
    } catch (error) {
        console.log('An error occured while connecting to database ',error)
    }
}

start()