import 'dotenv/config'
import connectDb from './db/index.js';
import {app} from './app.js';
const PORT=process.env.PORT || 3000;
 connectDb()
.then(() => {
   
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}   )
.catch((err) => {
    console.log('Error connecting to database:', err);
    process.exit(1);
}); 

    

