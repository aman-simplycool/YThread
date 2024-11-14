import mongoose, { Schema, Document, Types } from "mongoose";
import SingleThreadModel from "./singleThread";

export interface UserThread extends Document {
  userName: string;
  threads: Types.ObjectId[];
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
});

const UserThreadModel = mongoose.models.UserThread || mongoose.model<UserThread>('UserThread', userThreadSchema);

export default UserThreadModel;
