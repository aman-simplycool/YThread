import dbConnect from "@/lib/connection";
import CommunityModel from "@/models/community";
import UserModel from "@/models/user";
import { apiResponse } from "@/types/apiResponse";

export async function POST(request:Request){
  await dbConnect();
  try {
    const{userName,communityName,category}= await request.json();
    if(!userName || !communityName || !category){
      return Response.json({message:"incomplete data",status:500,success:false});
    }
    const communityObj = new CommunityModel({
      userName,
      communityName,
      category,
      followers:0,
      following:0,
      createdAt:new Date(Date.now()),
      yThreads:[],
    });
    const userObj = await UserModel.findOne({userName});
    if(!userObj){
      return Response.json({success:false,message:"some error occured while fetching user with this userName",status:500});
    }
    const response = await communityObj.save();
    userObj.community = response.id;
    await userObj.save();
    return Response.json({message:"stored data sucessfully",status:200,success:true});
  } catch (error) {
    const errorResponse = error as apiResponse;
    console.log(errorResponse);
    return Response.json({message:errorResponse,status:"400",success:false});
  }
}