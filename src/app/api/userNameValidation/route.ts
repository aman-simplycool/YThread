import {z} from 'zod';
import dbConnect from '@/lib/connection';
import UserModel from '@/models/user';
import { userNameValidation } from '@/schemas/signupSchema';

const UserNameQuerySchema = z.object({
  userName:userNameValidation
})
export async function GET(request:Request){
  await dbConnect();
  try {
    const {searchParams} = new URL(request.url);
    const queryParams = {
      userName:searchParams.get('userName')
    }
    const result = UserNameQuerySchema.safeParse(queryParams);
    if(!result.success){
      const usernameErrors = result.error.format().userName?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(', ')
              : 'Invalid query parameters',
        },
        { status: 400 }
      );
    }
    const {userName} = result.data;
    const userExistsVerified = await UserModel.findOne({userName,isVerified:true});
    if(userExistsVerified){
      return Response.json({
        message:"username already taken",
        success:false
      })
    }
    return Response.json({
      message:"username available",
      success:true
    })
  } catch (error) {
    console.log(error);
    return Response.json({message:error,status:500,success:false});
  }
}