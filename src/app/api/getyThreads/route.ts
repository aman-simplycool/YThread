import UserModel from "@/models/user";
import UserThreadModel from "@/models/UserThreads";
import dbConnect from "@/lib/connection";

export async function GET(request:Request){
  await dbConnect();
  try {
    const {searchParams}= new URL(request.url);
    const  userName = searchParams.get('userName');
    const response = await UserThreadModel.find({ userName: { $ne: userName } })
      .populate({
        path: 'threads',
      })
      .exec();
    const threads = response.map((item)=>item.threads).flat();
    return Response.json({message:"threads fetched succesfully",status:200,threads,success:true});
  } catch (error) {
    console.log(error);
    return Response.json({
      message:"some error occured while retrieving yThreads",
      status:400,
      success:false
    });
  }

}