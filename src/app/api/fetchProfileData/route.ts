import dbConnect from "@/lib/connection";
import UserThreadModel from "@/models/UserThreads";
import CommunityModel from "@/models/community";
import UserModel from "@/models/user";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userName = searchParams.get('userName');
  try {
    const userObj = await UserModel.findOne({ userName });
    const communityObj = userObj ? null : await CommunityModel.findOne({ communityName:userName});

    // If user object exists
    if (userObj) {
      const createdAt = new Date(parseInt(userObj._id.toString().substring(0, 8), 16) * 1000);
      
      const threadsArr = await UserThreadModel.aggregate([
        { $match: { userName } },
        {
          $unwind: '$threads'
        },
        {
          $lookup: {
            from: 'singlethreads',
            localField: 'threads',
            foreignField: '_id',
            as: 'threadsArr'
          }
        },
        {
          $unwind: '$threadsArr'
        },
        {
          $project: {
            _id: 0,
            threadsArr: 1
          }
        }
      ]);
      const threads = threadsArr.map(item => item.threadsArr);

      const result = {
        createdAt,
        threadsArr:threads,
        email: userObj.email || '',
        community: userObj.community || '',
        following: userObj.following || 0,
        followers: userObj.followers || 0,
      };
      return new Response(JSON.stringify({ success: true, result, status: 200 }), { status: 200 });
    }

    // If community object exists
    if (communityObj) {
      const createdAt = new Date(parseInt(communityObj._id.toString().substring(0, 8), 16) * 1000);

      const threadsArr = await CommunityModel.aggregate([
        { $match: { communityName:userName } },
        {
          $unwind: '$yThreads'
        },
        {
          $lookup: {
            from: 'singlethreads',
            localField: 'yThreads',
            foreignField: '_id',
            as: 'threadsArr'
          }
        },
        {
          $unwind: '$threadsArr'
        },
        {
          $project: {
            _id: 0,
            threadsArr: 1
          }
        }
      ]);
      const threads = threadsArr.map(item => item.threadsArr);
      const result = {
        createdAt,
        threadsArr:threads,
        owner: communityObj.userName || '',
        following: communityObj.following || 0,
        followers: communityObj.followers || 0,
      };
      console.log('12345',threads);
      return new Response(JSON.stringify({ success: true, result, status: 200 }), { status: 200 });
    }

    // No user or community found
    return new Response(JSON.stringify({ success: false, message: "User or community not found", status: 404 }), { status: 404 });

  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error, success: false, status: 400 }), { status: 400 });
  }
}
