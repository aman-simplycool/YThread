import mongoose from "mongoose";
const MONGODB_URI = "mongodb+srv://guptaaman200229:guptaaman@cluster0.efpv1.mongodb.net/";
type connectionObject = {
  isConnected?:number;
};
const connection : connectionObject={};

async function dbConnect():Promise<void>{
  if(connection.isConnected){
    console.log("db connection already exists"); 
    return;
  }
  try {
    const db = await mongoose.connect(MONGODB_URI||'',{});
    connection.isConnected = db.connections[0].readyState;
    console.log("db connected successfully");
  } catch (error) {

    console.log("error occured while creating db connection",error);
    process.exit(1);
  }
}
export default dbConnect;