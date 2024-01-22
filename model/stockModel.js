const mongoose=require('mongoose');
require('dotenv').config();
const db_link=process.env.MONGO_URI;

mongoose.connect(db_link)
.then(function(db){
    console.log('stock db connected');
})
.catch(function(err){
    console.log(err);
});

const stockSchema=new mongoose.Schema({
    SC_CODE:{
        type: Number,
        required: true
    },
    SC_NAME:{
        type: String,
        required: true
    },
    OPEN:{
        type: Number,
        required: true
    },
    HIGH:{
        type: Number
    },
    LOW:{
        type: Number
    },
    CLOSE:{
        type: Number
    },
    NO_OF_SHRS:{
        type: Number
    },
    NET_TURNOV:{
        type:Number
    },
    DATE:{
        type: Date
    }

})

const stockModel=mongoose.model('stockModel', stockSchema);
module.exports=stockModel;