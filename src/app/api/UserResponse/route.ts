import dbConnect from "@/lib/connection";
import SingleThreadModel from "@/models/singleThread";

export async function POST(req:Request){
  await dbConnect();
  try {
    const {userResponse, id, type, userName} = await req.json();
    console.log(userName);
    
    if(!userResponse || !id || !type)return Response.json({message:"insufficient data",status:500,success:false});
    const threadObj = await SingleThreadModel.findById(id);
    const isUserAlreadySupported = threadObj.supportUsers.includes(userName);
    const isUserAlreadyOpposed = threadObj.againstUsers.includes(userName);

    console.log(threadObj);
    
    if(type === 'yes'){
      console.log(isUserAlreadyOpposed,isUserAlreadySupported,type,id,userResponse);
      if(userResponse === -1 && isUserAlreadySupported){        
        // Remove the userName from supportUsers
        threadObj.supportUsers = threadObj.supportUsers.filter((user:string) => user !== userName);
        // Reduce the yesCount by 1
        threadObj.yesCount = Math.max(0, threadObj.yesCount - 1);
        await threadObj.save();
        return Response.json({success:true,message:'updated successfully',status:200});
      }
      else if(userResponse===1 && isUserAlreadyOpposed && !isUserAlreadySupported){
        threadObj.againstUsers = threadObj.againstUsers.filter((user:string) => user !== userName);
        threadObj.supportUsers.push(userName);
        threadObj.yesCount+=1;
        threadObj.noCount-=1;
        await threadObj.save();
        console.log(isUserAlreadyOpposed,isUserAlreadySupported,'h2');
        return Response.json({success:true,message:'updated successfully',status:200});
      }
      else if(userResponse===1 && !isUserAlreadySupported && !isUserAlreadyOpposed){
        threadObj.yesCount+=1;
        threadObj.supportUsers.push(userName);
        await threadObj.save();
        return Response.json({success:true,message:'updated successfully',status:200});
      }
      else{
        return Response.json({status:200,success:false,message:'we can not update your response'});
      }
    }
    else{
      if(userResponse===-1 && isUserAlreadyOpposed){
        threadObj.noCount-=1;
        threadObj.againstUsers = threadObj.againstUsers.filter((user:string)=>user!=userName);
        await threadObj.save();
        return Response.json({success:true,message:'updated successfully',status:200});
      }
      else if(userResponse===1 && isUserAlreadySupported && !isUserAlreadyOpposed){
        threadObj.supportUsers = threadObj.supportUsers.filter((user:string) => user !== userName);
        threadObj.opposedUsers.push(userName);
        threadObj.yesCount-=1;
        threadObj.noCount+=1;
        await threadObj.save();
        return Response.json({success:true,message:'updated successfully',status:200});
      }
      else if(userResponse===1 && !isUserAlreadyOpposed && !isUserAlreadySupported){
        threadObj.againstUsers.push(userName);
        threadObj.noCount+=1;
        await threadObj.save();
        return Response.json({success:true,message:'updated successfully',status:200});
      }
      else{
        return Response.json({success:false,message:'we cant update',status:200});
      }
  }
 } catch (error) {
    console.log(error,'>>>>>>hey i am error');
    return Response.json({message:"some error occured",status:500,success:false});
  }
}