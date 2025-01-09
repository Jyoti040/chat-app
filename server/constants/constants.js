const cookieOptions = {
    maxAge:15*24*60*60*1000, // 15 days
    sameSite:"none",
    httpOnly : true ,
    secure : true ,
  }

  const corsOptions ={
    origin : process.env.CORS_ORIGIN,  // can pass array -[]
    credentials : true ,
    methods:["GET","PUT","POST","DELETE"]
}

  module.exports = {cookieOptions , corsOptions}