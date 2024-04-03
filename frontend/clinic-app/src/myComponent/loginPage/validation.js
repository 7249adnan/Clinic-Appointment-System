
export const validatePassword = (data) => {

  // eslint-disable-next-line
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.\/?\\|\-=]).{6,20}$/;

  if (data.length < 6) {
    return {
      getPasswordBoolValue: false,
      errorPasswordMessage: " * Password must be at least 6 characters long.",
    }
  }
  else if(data.length > 20){
    return {
      getPasswordBoolValue: false,
      errorPasswordMessage: " * Password must be Less than 20 characters long.",
    };
  } 
  else if(!passwordRegex.test(data)){
    return {
      getPasswordBoolValue: false,
      errorPasswordMessage: " * Password must Condtain Capital case leter and Small case letter .",
    };
  }     
  else {
    return { getPasswordBoolValue: true, errorPasswordMessage: "" };
  }

};


export const validateEmail = (data) => {
  if (data.length < 5) {    
    return {
      getEmailBoolValue: false,
      errorEmailMessage: "email must be at least 5 characters long.",
    };
  } else {
    return { getEmailBoolValue: true, errorEmailMessage: "" };
  }
};

export const validateLogin = (val)=>{

  if (val === "emailError" ) {    
    return {
      getEmailBoolValue: false,
      errorEmailMessage: "* InnCorrect Email Id ",
    };
  } 
  else if(val === "passwordError"){
    return {
      getPasswordBoolValue: false,
      errorPasswordMessage: "* InCorrect Password ",
    };
  }
  else if (val==="success") {
    return { getEmailBoolValue: true, errorEmailMessage: "", getPasswordBoolValue: true, errorPasswordMessage: ""  };
  }
  else {
    alert(" Opps.. Something Went Wrong !!! in VALIDATE.JS ");
  }

}


// export const validateInput = (inputValue, type) => {
//   // Minimum length validation
//   if (inputValue.email.length < 5 && type === "email") {
//     return {
//       getEmailBoolValue: false,
//       errorEmailMessage: "Email must be at least 5 characters long.",
//     };
//   } else {
//     return { getEmailBoolValue: true, errorEmailMessage: "" };
//   }

//   if (inputValue.password.length < 6 && type === "password") {
//     return {
//       getPasswordBoolValue: false,
//       errorPasswordMessage: "Password must be at least 6 characters long.",
//     };
//   }

//   // // Maximum length validation
//   // if (inputValue.email.length > process.env.REACT_APP_PASSWORD_MAX_LEN) {
//   //   return { getVal: false, errorMessage: 'Input must not exceed 20 characters.' };
//   // }

//   // // Regular expression validation for alphanumeric characters
//   // const alphanumericRegex = /^[a-zA-Z0-9]+$/;
//   // if (!alphanumericRegex.test(inputValue)) {
//   //   return { getVal: false, errorMessage: 'Input must contain only alphanumeric characters.' };
//   // }

//   // All validations passed
//   return {
//     getEmailBoolValue: true,
//     getPasswordBoolValue: true,
//     errorPasswordMessage: "",
//     errorEmailMessage: "",
//   };
// };
