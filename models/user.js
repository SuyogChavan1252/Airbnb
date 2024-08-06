const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');  //it will automatically add username and passwrord  to user 

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    }
})
userSchema.plugin(passportLocalMongoose);  //automatic username and password to user
module.exports = mongoose.model('User', userSchema);