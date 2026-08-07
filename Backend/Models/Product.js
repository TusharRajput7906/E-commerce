const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Name is required"],
            trim:true,
        },
        description:{
            type:String,
            required:[true,"Description is required"],
        },
        price:{
            type:Number,
            required:[true,"Price is required"],
            min:[0,"Price cannot be negative"]
        },
        category:{
            type:String,
            required:[true,"Category is required"],
        },
        brand:{
            type:String,
            default:"Generic",
        },
        stock:{
            type:Number,
            required:true,
            default:0,
            min:[0,"Stock cannot be negative"],
        },
        image:[{
            url:{type:String,required:true},
            public_id:{type:String},
        }
    ],
    rating:{
        type:Number,
        default:0,
    },
    numReviews:{
        type:Number,
        default:0,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    },
    {timestamps:true}
);

module.exports = mongoose.model("Product",productSchema);