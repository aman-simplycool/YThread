import UserThreadModel from "@/models/UserThreads";
import dbConnect from "@/lib/connection";
import CommunityModel from "@/models/community";

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get('userName');
    
    // Fetch user's individual threads from UserThreadModel
    const userThreadsResponse = await UserThreadModel.aggregate([
      { $match: { userName } },
      {
        $lookup: {
          from: 'singlethreads',
          localField: 'threads',
          foreignField: '_id',
          as: 'threadDetails'
        }
      },
      { $unwind: '$threadDetails' },
      {
        $project: {
          _id: 0,
          threadDetails: 1
        }
      }
    ]);

    // Fetch community details for the user
    const communityObj = await CommunityModel.findOne({ userName }) || {};
    const communityName = communityObj.communityName || '';

    // Fetch community threads if the user is part of a community
    let communityThreadsResponse = [];
    if (communityName) {
      communityThreadsResponse = await CommunityModel.aggregate([
        { $match: { communityName } },
        {
          $lookup: {
            from: 'singlethreads',
            localField: 'yThreads',
            foreignField: '_id',
            as: 'threadDetails'
          }
        },
        { $unwind: '$threadDetails' },
        {
          $project: {
            _id: 0,
            threadDetails: 1
          }
        }
      ]);
    }

    // Combine user threads and community threads
    const allThreads = [
      ...userThreadsResponse.map((item) => item.threadDetails),
      ...communityThreadsResponse.map((item) => item.threadDetails)
    ];

    return Response.json({
      message: 'Successfully fetched threads',
      status: 200,
      threads: allThreads,
      success: true,
    });

  } catch (error) {
    return Response.json({
      message: "An error occurred while fetching threads",
      status: 500,
      success: false,
    });
  }
}
