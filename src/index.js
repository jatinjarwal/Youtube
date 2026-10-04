import 'dotenv/config'
import connectDb from './db/index.js';
import {connectredis} from './db/redis.js'
import {app} from './app.js';
const PORT=process.env.PORT || 3000;
Promise.all([connectDb(),connectredis()])
.then(() => {
   
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}   )
.catch((err) => {
    console.log('Error connecting to database:', err);
    process.exit(1);
}); 

    

