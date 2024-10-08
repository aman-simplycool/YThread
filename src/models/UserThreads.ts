import mongoose, { Schema, Document, Types } from "mongoose";
import SingleThreadModel from "./singleThread";

export interface UserThread extends Document {
  userName: string;
  threads: Types.ObjectId[];
  followers?:number;
  following?:number;
}
export const userThreadSchema = new Schema({
  userName: {
    required: true,
    type: String,
  },
  
  threads: [{
    type: Schema.Types.ObjectId,
    ref: SingleThreadModel.modelName,
  }],
  following:{
    type:Number,
    require:true,
    default:0
  },
  followers:{
    type:Number,
    require:true,
    default:0
  }
});

const UserThreadModel = mongoose.models.UserThread || mongoose.model<UserThread>('UserThread', userThreadSchema);

export default UserThreadModel;
