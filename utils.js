const validator = require('validator')


const checkIfValidEmail = (email)=>{
    return validator.isEmail(email)
}
module.exports = checkIfValidEmail;