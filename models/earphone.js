const mongoose = require("mongoose");

const earphoneSchema = new mongoose.Schema({

    brand:{ type:String,required:true},
    model:{ type:String,required:true},
    type:{ type:String,required:true},
    price:{ type:Number,default: 0},
    color:{ type:String,default:"black"},
    rating:{ type:Number,default:0},
    in_stock:{ type:Boolean,default:true},
    image:[String]
})

const Earphone = mongoose.model("Earphones",earphoneSchema);

module.exports = Earphone;