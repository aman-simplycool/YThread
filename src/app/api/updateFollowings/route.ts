import UserModel from "@/models/user";
import dbConnect from "@/lib/connection";

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const { currentUser, userName, doesFollows } = await request.json();

    // Check if the user is attempting to follow or unfollow
    if (!doesFollows) {
      const currentUserObj = await UserModel.findOne({ userName: currentUser });
      const targetUserObj = await UserModel.findOne({ userName });
        // Add the target user to the current user's following array
        if (!currentUserObj.following) {
          currentUserObj.following = [];
        }
        if (!targetUserObj.followers) {
          targetUserObj.followers = [];
        }
          currentUserObj.following.push(userName);

        // Add the current user to the target user's followers array
          targetUserObj.followers.push(currentUser);

        // Save the updated documents
        await currentUserObj.save();
        await targetUserObj.save();
        
        return new Response(JSON.stringify({ message: 'followed successfully',success:true ,status:200}));
    } else {
      // Handle unfollowing logic here
      const currentUserObj = await UserModel.findOne({ userName: currentUser });
      const targetUserObj = await UserModel.findOne({ userName });

        // Remove the target user from the current user's following array
        currentUserObj.following = currentUserObj.following.filter((following:String[]) => following !== userName);

        // Remove the current user from the target user's followers array
        targetUserObj.followers = targetUserObj.followers.filter((followers: String[]) => followers !== currentUser);

        await currentUserObj.save();
        await targetUserObj.save();

        return new Response(JSON.stringify({ message: 'Unfollowed successfully',success:true ,status:200}));
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
