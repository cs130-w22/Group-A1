//import React from 'react';
//Handles error messages for signup form
function ValidationInputs(val) {
  //error variable dict 
  let showError ={};
  //reference https://www.itsolutionstuff.com/post/react-email-validation-exampleexample.html
  //let email_letters = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
  //username part
  //if(!val.username){showError.username = "Please Enter your username."}
  
  //email validation part
  //if(!val.email){showError.email="Please Enter your Email."}
  //else if (!email_letters.test(val.email)){showError.email = "Please use valid Characters."}
  
  //password validation part
  //if(val.password.length < 4){if(val.password.length == 0){showError.password = "Please Enter Password"}
  //  else{showError.password = "Please Provide more than Four Characters."}}
  if(val.password !== val.repassword)
  {showError.repassword = "Password Do Not Match."}
  return showError;
};
export default ValidationInputs;
