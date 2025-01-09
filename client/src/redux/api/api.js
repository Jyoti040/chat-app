import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { server } from "../../constants/config"

const api=createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery({
        baseUrl:`${server}/api/v1/`
    }),
    tagTypes:["Chat","User"],  //cache data that is fetched
    endpoints:(builder)=>({
       myChats : builder.query({ //get req
           query:()=>({
            url:"chat/my-chats",
            credentials:"include"
           }),
           providesTags:["Chat"]  // to invalidate data , so data refetched and new cache
       }),

       searchUser : builder.query({
        query:(name)=>({
            url:`user/search-user?name=${name}`,
            credentials:"include"
        }),
        providesTags:["User"]
       }),

       chatDetails : builder.query({
        query:({chatId , populate=false})=>{
           let url=`/chat/${chatId}`
           if(populate) url+="?populate=true"

           return {
                url,
                credentials:"include"
            }
        },
        providesTags:["Chat"]
       }),

       getNotifications : builder.query({
        query:()=>({
            url:"user/notifications",
            credentials:"include"
        }),
        keepUnusedDataFor:0 //no caching of data
       }),

       sendFriendRequest : builder.mutation({
        query:(data)=>({
          url:"/user/send-friend-request",
          method:"PUT",
          credentials:"include",
          body:data
        }),
        invalidatesTags:["User"] // after this api is called , data will be refetched
       }) ,

       acceptFriendRequest : builder.mutation({
        query:(data)=>({
          url:"/user/accept-friend-request",
          method:"PUT",
          credentials:"include",
          body:data
        }),
        invalidatesTags:["Chat"]
       }) ,
    })
})

export default api
export const { 
    useMyChatsQuery ,
    useLazySearchUserQuery , 
    useSendFriendRequestMutation , 
    useGetNotificationsQuery  , 
    useAcceptFriendRequestMutation ,
    useChatDetailsQuery
} = api