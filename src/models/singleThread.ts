import mongoose, { Schema, Document, Types } from "mongoose";

// Define the interface for your SingleThread document
export interface SingleThread extends Document {
  userName: string;
  createdAt: Date;
  yesCount: number;
  noCount: number;
  message: string;
  title: string;
  supportUsers:Array<string>;
  againstUsers:Array<string>;
}

// Define the schema for SingleThread
const singleThreadSchema = new Schema<SingleThread>({
  yesCount: {
    type: Number,
    required: true,
    default: 0,
  },
  title:{
    type:String,
    required:true,
    default:'',
  },
  noCount: {
    type: Number,
    required: true,
    default: 0,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userName:{
    type:String,
    required:true,
  },
  supportUsers:[{
    type:String,
  }],
  againstUsers:[{
    type:String,
  }]
});

// Model definition for SingleThread
const SingleThreadModel = mongoose.models.SingleThread || mongoose.model<SingleThread>('SingleThread', singleThreadSchema);

export default SingleThreadModel;
