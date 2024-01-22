const mongoose=require('mongoose');
const emailValidate=require('email-validator');


require('dotenv').config();
const db_link=process.env.MONGO_URI;

mongoose.connect(db_link)
.then(function(db){
    console.log('user db connected');
})
.catch(function(err){
    console.log(err);
});

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate: function(){
            return emailValidate.validate(this.email);
        }
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    confirmPassword:{
        type:String,
        required:true,
        minLength:8,
        validate: function(){
            return this.password==this.confirmPassword;
        }
    },
    favourites: [
        {
            stockID: {
                type: Number,
            }
        },
    ]
})

const userModel=mongoose.model('userModel', userSchema);

module.exports=userModel;