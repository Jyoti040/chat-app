import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromLocalStorage } from "../../lib/features";

const initialState = {
   notificationCount : 0,
   newMessagesAlert : getOrSaveFromLocalStorage({key:"new_message_alert",get:true}) ||
    [{
      chatId:"",
      count:0
   }],
   // newMessagesAlert : getOrSaveFromLocalStorage({key:"new_message_alert",get:true}) ? 
   // ( getOrSaveFromLocalStorage({key:"new_message_alert",get:true})) :
   // ([{
   //    chatId:"", count:0
   // }])
}

const chatSlice = createSlice({
     name:"chat",
     initialState,
     reducers:{
            incrementNotification : (state)=>{
               state.notificationCount+=1
            },
            resetNotification : (state)=>{
               state.notificationCount = 0
            },
            setNewMessagesAlert : (state,action)=>{
               const index = state.newMessagesAlert.findIndex((item)=>item.chatId === action.payload.chatId) 

               if(index!=-1){
                  state.newMessagesAlert[index].count+=1
               }else{
                  state.newMessagesAlert.push({
                     chatId:action.payload.chatId,
                     count:1
                  })
               }
            },
            removeMessagesAlert : (state,action)=>{
               state.newMessagesAlert = state.newMessagesAlert.filter((item)=>item.chatId !== action.payload)
               // getOrSaveFromLocalStorage({key:"new_message_alert",value:{
               //    chatId:action.payload.chatId,
               //    count:0
               // }})
               console.log("in remove message alert ",state.newMessagesAlert)
            }
         }
})

export default chatSlice;
export const {
   incrementNotification,
   resetNotification,
   setNewMessagesAlert,
   removeMessagesAlert
} = chatSlice.actions