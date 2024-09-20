import mongoose,{Schema,Document,Types} from "mongoose";

export interface community extends Document {
  userName: string;
  communityName: string;
  category:string;
  followers:number;
  following:number;
  createdAt: Date;
  yThreads:Types.ObjectId[]; 
}

const communitySchema = new Schema <community>({
  userName:{
    required:true,
    type:String,
  },
  communityName:{
    required:true,
    type:String,
  },
  category:{
    required:true,
    type:String,
  },
  following:{
    type:Number,
    required:true,
  },
  followers:{
    type:Number,
    required:true,
  },
  createdAt:{
    required:true,
    type: Date,
  },
  yThreads:[{
    type: Schema.Types.ObjectId,
    ref: 'SingleThread',
  }]
});

const CommunityModel = mongoose.models.community || mongoose.model<community>('community',communitySchema);
export default CommunityModel;