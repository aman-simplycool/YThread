import SingleThreadModel from "@/models/singleThread";
import dbConnect from "@/lib/connection"

export async function GET(request:Request){
  await dbConnect();
  try {
    const threads = await SingleThreadModel.aggregate([
      {
        $addFields: {
          totalVotes: { $add: ["$yesCount", "$noCount"] }
        }
      },
      {
        $sort: { totalVotes: -1 }
      },
      {
        $limit: 20
      }
    ]);
    return Response.json({
      message:"fetched trending 20 ythreads",
      success:true,
      Threads:threads,
      status:200
    })
  } catch (error) {
    console.log(error);
    return Response.json({
      success:false,
      message:"some error occured while fetching trending threads",
      status:500
    })
  }
}