import { UserThread } from "@/models/UserThreads";
import { SingleThread } from "@/models/singleThread";

export interface apiResponse{
  success:boolean,
  message:string,
  messages?:Array<UserThread>,
  status?:number,
  Threads?:Array<SingleThread>,
  topFollowing?:Array<UserThread>,
  userName?:string,
  communityName?:string,
  yesCount?:number,
  thread?:SingleThread,
  user?:UserThread,
  createdAt?:Date
}