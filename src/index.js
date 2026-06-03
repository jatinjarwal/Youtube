import 'dotenv/config'
import connectDb from './db/index.js';
import {app} from './app.js';
const PORT=process.env.PORT || 3000;
 connectDb()
.then(() => {
    console.log('Connected to database successfully');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}   )
.catch((err) => {
    console.error('Error connecting to database:', err);
}); 

    

