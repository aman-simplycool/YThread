import UserModel from "@/models/user";
import dbConnect from "@/lib/connection";
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { currentUser, targetUser } = await request.json();
    if (currentUser && targetUser) {
      const targetUserObj = await UserModel.findOne({ userName: targetUser });
      if (targetUserObj) {
        // Check if the currentUser is in the targetUser's followings
        const followers = targetUserObj.followers || [];
        const isFollowing = followers.includes(currentUser);

        if (isFollowing) {
          // currentUser is following targetUser
          return Response.json({ success: true, message: "User is already following",isFollowing:true});
        } else {
          // currentUser is not following targetUser
          return Response.json({ success: true, message: "User is not following", isFollowing:false});
        }
      }
      return Response.json({success:false,message:"invalid arguements"})
    }
    return Response.json({success:false,message:"invalid arguements"})
  } catch (error) {
    console.log(error);
    
    return Response.json({ success: false, message: "An error occurred", error });
  }
}
