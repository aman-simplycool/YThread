import SingleThreadModel from "@/models/singleThread";
import UserModel from "@/models/user";
import UserThreadModel from "@/models/UserThreads";
import dbConnect from "@/lib/connection";
import { authOptions } from "../auth/[...nextauth]/option";
import { getServerSession } from "next-auth";
import CommunityModel from "@/models/community";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { userName, message, title, communityName, communityPost } = await request.json();
    const user = await UserModel.findOne({userName});

    if (!user) {
      return Response.json({
        message: "User not found",
        status: 404,
        success: false,
      });
    }
    if(communityPost==true){
      // add the thread into single threads table
      const singleThreadObj = new SingleThreadModel({
        message,
        title,
        userName:communityName,
        createdAt: Date.now(),
        supportUsers:[],
        againstUsers:[],
        yesCount:0,
        noCount:0,
      });
      const savedThread = await singleThreadObj.save();
      const savedThreadId = savedThread._id;

      //2-> save it into communities 
      const communityObj = await CommunityModel.findOne({communityName});
      if(communityObj){
        communityObj.yThreads.push(savedThreadId);
        await communityObj.save(); 
      }
      return Response.json({success:true,message:"saved successfully",status:200});
    }
    else{
      //single thread
      const singleThreadObj = new SingleThreadModel({
        message,
        title,
        userName,
        createdAt: Date.now(),
        supportUsers:[],
        againstUsers:[],
        yesCount:0,
        noCount:0,
      });

    const savedThread = await singleThreadObj.save();
    const savedThreadId = savedThread._id;
    //ythread
    user.yThreads.push(savedThreadId);
    await user.save();
    //userthread table
    const userThreadObj = await UserThreadModel.findOne({userName});
    if(userThreadObj){
      userThreadObj.threads.push(savedThreadId);
      await userThreadObj.save();
    }
    else{
      const newUserThreadObj = new UserThreadModel({
        userName,
        threads:[savedThreadId]
      })
      await newUserThreadObj.save();
    }
    return Response.json({success:true,message:"saved successfully",status:200});
    }
  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      message: "Some error occurred while saving",
      status: 500,
      success: false,
    });
  }
}
