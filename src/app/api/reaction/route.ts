import SingleThreadModel from "@/models/singleThread";
import dbConnect from "@/lib/connection";
import { user } from "@nextui-org/react";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { yThreadId, userName,response } = await request.json();
    const threadWithId = await SingleThreadModel.findOne({
      _id:yThreadId
    });
    if(response==='Yes'){
      threadWithId.yesCount++;
    }
    else{
      threadWithId.noCount++;
    }
    await threadWithId.save()
    return Response.json({message:"response successfully taken",status:200,success:true});
  } catch (error) {
    console.log(error);
    return Response.json({message:"there is some error while updating the response",status:500,success:false});
  }
}
