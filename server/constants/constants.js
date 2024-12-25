const cookieOptions = {
    maxAge:15*24*60*60*1000, // 15 days
    sameSite:"none",
    httpOnly : true ,
    secure : true ,
  }

  module.exports = {cookieOptions}