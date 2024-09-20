import { NextAuthOptions } from "next-auth";

declare module 'next-auth'{
  interface User{
    _id?:string,
    userName:string,
    isVerified?:boolean,
    userName?:string,
  }
  interface Session{
    user:{
      _id?:string,
      userName:string,
      isVerified?:boolean,
    } & DefaultSession['user']
  } 
}
declare module 'next-auth/jwt' {
  interface JWT{
    _id?:string,
    userName?:string,
    isVerified?:boolean,
  }
}