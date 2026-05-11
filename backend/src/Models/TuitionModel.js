/*
campos
student_id
amount
paymentDate
method
status
referenceNumber
*/
import mongoose, { Schema, model } from "mongoose";

const tuitionSchema = new Schema(
  {
    amount: {
      type: Number,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
    },
    paymentDate:{
        type:Date
    },
    method:{
        type : String
    },
    status:{
        type:Boolean
    },
    referenceNumber:{
        type:String
    },
  },
  {
    timestamps: true,
    strict: false,
  },
);

export default model("tuition", tuitionSchema);
