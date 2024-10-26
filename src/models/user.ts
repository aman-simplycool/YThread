import mongoose, { Schema, Document, Types } from "mongoose";
import SingleThreadModel from "./singleThread";

export interface user extends Document {
  userName: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  yThreads: Types.ObjectId[];
  community:string;
}

const userSchema = new Schema<user>({
  userName: {
    required: true,
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  verifyCode: {
    type: String,
    required: [true, 'Verification code is required'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyCodeExpiry: {
    required: true,
    type: Date,
  },
  yThreads: [{
    type: Schema.Types.ObjectId,
    ref: SingleThreadModel.modelName,
  }],
  community:{
    type: String,
    default:''
  }
});

// Check if the model already exists
const UserModel = mongoose.models.User || mongoose.model<user>('User', userSchema);

export default UserModel;
