import dbConnect from "@/lib/connection";
import SingleThreadModel from "@/models/singleThread";

export async function GET(req:Request){
  await dbConnect();
  try {
    const {searchParams} = new URL(req.url);
    const id = searchParams.get('id');
    if(!id){
      return Response.json({success:false,message:'could not get id',status:500});
    }
    const threadObj = await SingleThreadModel.findById(id);
    return Response.json({success:true,message:'fetched thread',status:200,thread:threadObj});
  } catch (error) {
    return Response.json({success:false,message:error,statu:500});
  }
}