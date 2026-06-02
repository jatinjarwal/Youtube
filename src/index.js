import 'dotenv/config'
import connectDb from './db/index.js';
import {app} from './app.js';

connectDb()
.then(() => {
    console.log('Connected to database successfully');
}   )
.catch((err) => {
    console.error('Error connecting to database:', err);
}); 

const PORT=process.env.PORT || 3000;    
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
}); 
