import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   isNewGroup:false,
   isAddMember:false,
   isNotification:false,
   isMobileMenuFriend:false,
   isSearch:false,
   isFileMenu:false,
   isDeleteMenu:false,
   uploadingLoader:false,
   selectedDeletedChat:{
    chatId:"",
    groupChat:false
   }
}

const miscSlice = createSlice({
     name:"misc",
     initialState,
     reducers:{
           
     }
})

export default miscSlice;
export const {} = miscSlice.actions