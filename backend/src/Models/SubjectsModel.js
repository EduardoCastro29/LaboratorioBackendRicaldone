/*
campos
subjectName
teacher_id
isAvailable
*/
import mongoose, { Schema, model } from "mongoose";

const subjectSchema = new Schema(
  {
    subjectName: {
      type: String,
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
    },
    isAvailable:{
        type:String
    },
  },
  {
    timestamps: true,
    strict: false,
  },
);

export default model("subject", subjectSchema);
