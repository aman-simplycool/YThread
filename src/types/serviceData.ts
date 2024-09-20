import { SingleThread } from "@/models/singleThread";

export interface ServiceDataType{
  type?:string,
  threadsArr?:SingleThread[],
  newThread?:Partial<SingleThread>[],
  name?:string,
  CommunityName?:string,
  apiEndPoint?:string;
}