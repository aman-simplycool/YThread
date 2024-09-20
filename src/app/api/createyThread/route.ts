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
    
    if(communityPost === 'Yes'){
      user.community = communityName
    }
    user.yThreads.push(savedThreadId);
    await user.save();
    if(communityPost === 'No'){
      let userThread = await UserThreadModel.findOne({ userName });
        if (userThread) {
          userThread.threads.push(savedThreadId);
        } else {
          userThread = new UserThreadModel({
            userName:user,
            threads: [savedThreadId],
          });
        }
        await userThread.save();
      }
    else{
      let communityObj = await CommunityModel.findOne({communityName});
      communityObj.yThreads.push(savedThreadId);
      await communityObj.save();
    }
    return Response.json({
      message: "Thread created successfully",
      status: 200,
      success: true,
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      message: "Some error occurred while saving",
      status: 500,
      success: false,
    });
  }
}
