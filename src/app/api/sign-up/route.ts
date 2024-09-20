import { apiResponse } from "@/types/apiResponse"
import UserModel from "../../../models/user";
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from "../../../helper/resendEmail";
import dbConnect from "@/lib/connection";
export async function POST(request:Request)
{
await dbConnect();
try {
  const {userName,email,password} = await request.json();
  const existinguserVerifiedbyUserName = await 
    UserModel.findOne({
      userName,
      isVerified:true,
    })
    
    if(existinguserVerifiedbyUserName){
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }
    const userExistsByEmail = await 
      UserModel.findOne({
        email
      });

      const verifyCode = Math.floor(100000+Math.random()*600000).toString();
      if(userExistsByEmail){
         if(userExistsByEmail.isVerified){
          return Response.json(
            {
              success: false,
              message: 'User already exists with this email',
            },
            { status: 400 }
          );
         }
         else{
          const hashedPassword = await bcrypt.hash(password,10);
          userExistsByEmail.password = hashedPassword;
          userExistsByEmail.verifyCode = verifyCode;
          userExistsByEmail.verifyCodeExpiry = new Date(Date.now()+3600000);
          const response = await userExistsByEmail.save();
         }
      }
      else{
        const hashedPassword = await bcrypt.hash(password,10);
        const verifyCodeExpiry = new Date();
        verifyCodeExpiry.setHours(verifyCodeExpiry.getHours()+1);
        const userData = new UserModel({
          userName,
          email,
          password:hashedPassword,
          verifyCode,
          verifyCodeExpiry,
          isVerified:false,
          yThreads:[],
        })
        const response = await userData.save();
      }
      const emailResponse = await sendVerificationEmail(userName,email,verifyCode);
      if(emailResponse.success){
        return Response.json(
          {
            success: true,
            message: "verification code sent to your email successfully",
          },
          { status: 200 }
        );
      }
      return Response.json(
        {
          success: true,
          message: 'User registered successfully. Please verify your account.',
        },
        { status: 201 }
      );

} catch (error) {
  console.error('some error occured while signing up',error);
  return Response.json(
    {
      success: false,
      message: 'Error registering user',
    },
    { status: 500 }
  );
}
}