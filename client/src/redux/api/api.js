import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { server } from "../../constants/config"

const api=createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery({
        baseUrl:`${server}/api/v1/`
    }),
    tagTypes:["Chat"],  //cache data that is fetched
    endpoints:(builder)=>({
       myChats : builder.query({ //get req
           query:()=>({
            url:"chat/my-chats",
            credentials:"include"
           }),
           providesTags:["Chat"]  // to invalidate data , so data refetched and new cache
       })
    })
})

export default api
export const { useMyChatsQuery } = api