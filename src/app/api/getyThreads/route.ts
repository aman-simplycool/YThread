import UserModel from "@/models/user";
import UserThreadModel from "@/models/UserThreads";
import dbConnect from "@/lib/connection";
import CommunityModel from "@/models/community";
import SingleThreadModel from "@/models/singleThread";

export async function GET(request:Request){
  await dbConnect();
  try {
    const {searchParams}= new URL(request.url);
    const  userName = searchParams.get('userName');
    const community = await CommunityModel.findOne({userName})||{};
    const communityName = community.communityName||"";
    const response = await SingleThreadModel.find({
      userName: {
        $exists: true, 
        $ne: null,
        $nin: [userName,communityName],
      }
    });

    return Response.json({message:"threads fetched succesfully",threads:response,status:200,success:true});
  } catch (error) {
    return Response.json({
      message:"some error occured while retrieving yThreads",
      status:400,
      success:false
    });
  }

}