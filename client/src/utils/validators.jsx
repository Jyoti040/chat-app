import { isValidUsername } from "6pp"


export const usernameValidator = (username)=>{
    if(isValidUsername){
        return {isValid:false , errorMesage:"User name is invalid"}
    }
}