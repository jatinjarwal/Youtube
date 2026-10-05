import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js'; 

const connectDb=async()=>{
    
        const connectionInstance=await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`Connected to database ${connectionInstance.connection.name} successfully`);
    
    
        
        
    
}

export default connectDb;