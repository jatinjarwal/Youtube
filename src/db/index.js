import mongoose from 'mongoose';
import { DB_NAME } from '../constansts.js'; 

const connectDb=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`Connected to database ${connectionInstance.connection.name} successfully`);
    }
    catch(error){
        console.log('Error connecting to database',error);
        process.exit(1)
    }
}

export default connectDb;