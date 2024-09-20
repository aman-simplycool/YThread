import dbConnect from "@/lib/connection";
import UserModel from "@/models/user";

export async function GET(req:Request){
  await dbConnect();
  try {
    const {searchParams} = new URL(req.url);
    const userName = searchParams.get('userName'); 
    const res = await UserModel.findOne({userName});
    const createdAt = new Date(parseInt(res._id.toString().substring(0, 8), 16) * 1000);
    return Response.json({status:200,createdAt,message:'got it',success:true})
  } catch (error) {
    console.log(error);
    return Response.json({error,status:400,success:false});
  }
}