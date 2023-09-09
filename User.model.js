const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email : {type : String , required : true},
    password : {type : String , required : true},
    name : {type : String , required : true},
    age : {type : Number}
})

const UserModel = mongoose.model('user',userSchema)

module.exports = {UserModel}