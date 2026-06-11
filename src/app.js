import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app=express();
app.use(express.json({limit:'12kb'}));
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({limit:'12kb', extended:true}));


import userRoutes from './routes/user.routes.js';
import commentRoutes from './routes/comment.routes.js'
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/comments',commentRoutes)
export {app};