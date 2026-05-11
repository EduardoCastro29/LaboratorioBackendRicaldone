/*
campos
specialtyName
isAvailable
*/
import mongoose, {Schema,model} from "mongoose";

const specialtySchema = new Schema(
    {
        specialtyName:{
            type:String
        },
        isAvailable:{
            type:Boolean
        }
        
    },
    {
        timestamps:true,
        strict:false,
    },
);

export default model ("specialty",specialtySchema);
