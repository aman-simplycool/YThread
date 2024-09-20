import dbConnect from "@/lib/connection";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import UserModel from "@/models/user";

export async function GET(){
  await dbConnect();
  try {
    // const session= await getServerSession(authOptions);
    // if(!session){
    //   return Response.json({message:'User not logged in',status:400,success:false});
    // }
    // const userData:User = session?.user;
    const topFollowing = await UserModel.aggregate([
      {
        $sort: {followers:-1}
      },
      {
        $limit:20,
      }
    ]);

      return Response.json({
        status:200,
        success:true,
        topFollowing,
        message:"successfully fetched top following users"
      })

  } catch (error) {
   return Response.json({
    status:400,
    success:false,
    message:"some error occured while fetching most followed users",
   });
  }
}