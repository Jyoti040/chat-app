import { isValidUsername } from "6pp"


export const usernameValidator = (username)=>{
    if(isValidUsername){
        return {isValid:false , errorMesage:"User name is invalid"}
    }
}

export const handlePassword = (e)=>{
    let tempPassword=e.target.value;
    setPassword(tempPassword)

    var lowerCase=/[a-z]/g;
    var upperCase=/[A-Z]/g;
    var digit=/\d/;
    var minLength=/.{8,}/;

    if(!minLength.test(password)) {
        setPasswordValidateMessage("Password must have atleast 8 characters");
        return;
    }else if(!digit.test(password)){
        setPasswordValidateMessage("Password must have atleast 1 digit");
        return;
    }else if(!upperCase.test(password)){
        setPasswordValidateMessage("Password must have atleast 1 uppercase letter");
        return;
    }else if(!lowerCase.test(password)){
        setPasswordValidateMessage("Password must have atleast 1 lowercase letter ");
        return;
    }else{
        setPasswordValidateMessage("")
        return;
    }
}