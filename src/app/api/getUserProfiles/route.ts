import dbConnect from "@/lib/connection";
import CommunityModel from "@/models/community";
import UserModel from "@/models/user";
export async function GET(request:Request){
  await dbConnect();
  const {searchParams} = new URL(request.url);
  const query = searchParams.get('query');
  try {
    const communityRes = await CommunityModel.aggregate([
      { 
        $match: { communityName: { $regex: query } } 
      },
      { 
        $project: {
          _id: 0,
          userName: "$communityName"
        }
      }
    ]);
    const res = await UserModel.find({userName:{$regex: query}}).select('userName');
    const result = communityRes.concat(res);
    return Response.json({success:true,usersArr:result,status:200});
  } catch (error) {
    return Response.json({status:400,success:false,error});
  }
}