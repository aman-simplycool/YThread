import dbConnect from "@/lib/connection";
import UserModel from "@/models/user";

export async function POST(request:Request){
  await dbConnect();
  try {
    const{userName,verifyCode}= await request.json();
    const userExistsByUserName = await UserModel.findOne({
      userName
    });
    if(!userExistsByUserName){
      return Response.json({message:"user is not present",status:400,success:false});
    }
    const isCodeCorrect = verifyCode===userExistsByUserName.verifyCode;
    const isVerificationExpired = new Date(userExistsByUserName.verifyCodeExpiry)>new Date();
    if(isVerificationExpired && isCodeCorrect){
      userExistsByUserName.isVerified = true;
      await userExistsByUserName.save();
      return Response.json({message:"verification done successfully",status:200,success:true});
    }
    else if(!isCodeCorrect){
      return Response.json({message:"invalid verification code",status:400,success:false});
    }
    return Response.json({message:"code expired please sign up again",status:400,success:false});

  } catch (error) {
    console.log(error);
    return Response.json({
      message:error,
      status:500,
      success:false
    })
  }
}