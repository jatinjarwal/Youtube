import {Queue,Worker} from 'bullmq'
import {Video} from "../models/video.model.js"
import{redis} from "../db/redis.js"
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import {deleteFromCloudinary} from '../utils/deleteUploads.js'

const VideoQueue= new Queue("VideoQueue",{connection:redis})


const VideoWorker= new Worker("VideoQueue",async(job)=>{
  const { 
        user_id, 
        title, 
        description, 
        videoLocalPath, 
        thumbnailLocalPath 
    } = job.data;
    let videoUpload;
    let thumbnailUpload;

    try {
       
        videoUpload = await uploadOnCloudinary(videoLocalPath);
        thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

        if (!videoUpload || !thumbnailUpload) {
            throw new Error("Failed to upload media to Cloudinary");
        }

      
        await Video.create({
            title,
            description,
            videoFile: videoUpload.url,
            thumbnail: thumbnailUpload.url,
            owner: user_id,
            isPublished: true 
        });

    } catch (error) {
       
      
        console.error(`Job ${job.id} failed, rolling back assets:`, error.message);
        
        if (videoUpload?.public_id) {
            await deleteFromCloudinary(videoUpload.public_id, "video");
        }
       
        if (thumbnailUpload?.public_id) {
            await deleteFromCloudinary(thumbnailUpload.public_id, "image");
        }

        throw new Error("Job aborted and assets cleaned up due to failure.");
    }
    

    

}, { connection: redis });

VideoWorker.on('failed', (job, err) => {
    console.error(`Video Job ${job.id} failed:`, err.message);
})

export {
    VideoQueue,
    VideoWorker
}