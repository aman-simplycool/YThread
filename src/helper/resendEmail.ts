import { resend } from "@/lib/resend";
import VerificationEmail from "../../emailTemplates/verificationEmail";
import { apiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
username:string,
email:string,
verifyCode:string):Promise<apiResponse>
{
  try {
    const response = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: 'Y Verification Code',
      react: VerificationEmail({username,otp:verifyCode}),
    });
    return({success:true,message:'succedd to send verification email'});
  } catch (error) {
    console.log(error,'failed to send verification email');
    return({success:false,message:'failed to send verification email'});
  }

}