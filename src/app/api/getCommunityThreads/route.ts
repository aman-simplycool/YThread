import dbConnect from "@/lib/connection";
import CommunityModel from "@/models/community";
export async function GET(req:Request){
  await dbConnect();
  const {searchParams}= new URL(req.url);
  const userName =searchParams.get('userName');
  try {
    if(!userName){
      return Response.json({message:"did not get the name",status:500,success:false});
    }
    const response = await CommunityModel.aggregate([
      {
        $match: { userName }
      },
      {
        $lookup: {
          from: 'singlethreads',  // Use the correct plural collection name
          localField: 'yThreads',
          foreignField: '_id',
          as: 'threads'
        }
      },
      {
        $project: {
          _id: 0,
          communityName: 1,
          createdAt: 1,
          threads: 1
        }
      }
    ]);
    
    
    const threads = response.map(item=>item.threadDetails);
    return Response.json({
      message:'succesful',
      success:true,
      threads:response[0].threads,
      createdAt:response[0].createdAt,
      communityName:response[0].communityName,
      status:200
    })
  } catch (error) {
    console.log(error);
    return Response.json({message:"some error occured",success:false,status:500});
  }
}