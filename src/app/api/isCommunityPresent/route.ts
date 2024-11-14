import dbConnect from "@/lib/connection";
import CommunityModel from "@/models/community";

export async function GET(req:Request){
  await dbConnect();
  try {
    const {searchParams} = new URL(req.url);
    const userName = searchParams.get('userName');
    const res = await CommunityModel.findOne({userName});
    if(res){
      return Response.json({status:200,message:"already exist",success:true,communityName:res.communityName,isPresent:true,communityHead:userName})
    }
    else{
      return Response.json({status:200,message:"can create",success:true,isPresent:false})
    }
  } catch (error) {
    return Response.json({message:"some error occured",status:500,success:false});
  }
}