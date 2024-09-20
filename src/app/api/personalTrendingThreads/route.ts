import UserThreadModel from "@/models/UserThreads";
import SingleThreadModel from "@/models/singleThread";
import dbConnect from "@/lib/connection";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userName = searchParams.get('userName');
  try {
    const topThreadsArr = await UserThreadModel.aggregate([
      {
        $match: { userName }
      },
      {
        $unwind: '$threads'
      },
      {
        $lookup: {
          from: 'singlethreads', // Collection name for SingleThread
          localField: 'threads',
          foreignField: '_id',
          as: 'threadDetails'
        }
      },
      {
        $unwind: '$threadDetails'
      },
      {
        $addFields: {
          total: { $sum: ['$threadDetails.yesCount', '$threadDetails.noCount'] }
        }
      },
      {
        $sort: { total: -1 }
      },
      {
        $limit: 20
      },
      {
        $project: {
          _id: 0, // Exclude the MongoDB _id field
          threadDetails: 1 // Include only the threadDetails
        }
      }
    ]);
    
    const threads = topThreadsArr.map(item => item.threadDetails);
    
    return Response.json({
      message: "Fetched personal best threads",
      success: true,
      status: 200,
      Threads: threads
    });
  } catch (error) {
    console.log(error);
    return Response.json({
      message: "Some error occurred",
      status: 500,
      success: false
    });
  }
}
