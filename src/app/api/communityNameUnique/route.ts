import dbConnect from "@/lib/connection";
import CommunityModel from "@/models/community";
export async function GET(request:Request){
  await dbConnect();
  try {
    const {searchParams} = new URL(request.url);
    const communityName = searchParams.get('communityName');
    const response = await CommunityModel.findOne({communityName});
    if(response){
      return Response.json({message:"sorry this name is not available",status:200,success:true});
    }
    else{
      return Response.json({message:"yepp! this name is available",status:200,success:true});
    }
  } catch (error) {
    console.log(error);
    return Response.json({message:"some error occured",status:500,success:false});
  }
}