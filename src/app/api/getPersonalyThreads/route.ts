import UserThreadModel from "@/models/UserThreads";
import dbConnect from "@/lib/connection";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import mongoose from "mongoose";

export async function GET(request:Request){
 await dbConnect();
 try {
  const {searchParams} = new URL(request.url);
  const userName = searchParams.get('userName');
  const response = await UserThreadModel.aggregate([
    { $match: { userName } },                      
    {
      $lookup: {
        from: 'singlethreads',
        localField:'threads',
        foreignField:'_id',
        as:'threadDetails'
      }
    },
    {
      $unwind: '$threadDetails'
    },
    {
      $project: {
        _id:0,
        threadDetails:1
      }
    }
  ]);
  const threads = response.map(item => item.threadDetails);
  return Response.json({
    message:'successful',
    status:200,
    threads,
    success:true,
  })
 } catch (error) {
  console.log(error);
  return Response.json({message:"some error occured while fetching your Threads",status:500,success:false});
 }
}