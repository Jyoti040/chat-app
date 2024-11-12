require('dotenv').config()
const express = require('express')
const app=express()

const connectDB = require('./db/connect')
const CustomError = require('./errors/CustomError')
const NotFoundMiddleware = require('./middleware/NotFound')
const ErrorHandlerMiddleware = require('./middleware/ErrorHandler')

const userRoutes = require('./routes/user')

app.use(express.json())

app.use('api/v1/user',userRoutes)

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