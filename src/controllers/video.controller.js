import asynchandler from "../utils/asynchandler.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "..//utils/ApiResponse.js"
import mongoose from "mongoose"
import { isValidObjectId } from "mongoose"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Comment } from "../models/comment.model.js" 
import { Like } from "../models/like.model.js" 
import { Playlist } from "../models/playlist.model.js" 
import { VideoQueue } from "../queues/video.queue.js"
import fs from "fs"




const getVideos= asynchandler(async(req,res)=>{
    const {page=1,limit=10,sortBy="views",sortType ="desc",query,user_id}=req.query
   
    const filterObject={isPublished:true}
    
     if(user_id){
         if( !isValidObjectId(user_id)){
                 throw new ApiError(400,"userid is invalid")
                 }
        filterObject.owner=user_id
     }
     if(query){
        filterObject.$or=[
            {
                title:{
                    $regex:query,
                    $options:"i"
                }
            },
            {
                description:{
                    $regex:query,
                    $options:"i"
                }
            }
        ]
     }
    const skip= (Number(page)-1)*Number(limit)
    const videos= await Video.find(filterObject).skip(skip).sort({[sortBy]:sortType==="asc"? 1:-1}).limit(Number(limit))
    if(videos.length==0){
        return res.status(200)
        .json(new ApiResponse(200,[],"no video found"))
    }
    const totalVideos= await Video.countDocuments(filterObject)
          return res.status(200)
        .json(new ApiResponse(200,{videos,totalVideos,page:Number(page),totalPages:Math.ceil(totalVideos/Number(limit))},"videos fetched successfully"))

})

const publishVideo= asynchandler(async(req,res)=>{
    const {title,description} =req.body
    const user_id=req.user._id
    if(!title?.trim()){
        throw new ApiError(400,"title is required")
    }
    const videoLocalPath=req.files?.videoFile?.[0]?.path
    
    const thumbnailLocalPath=req.files?.thumbnail?.[0]?.path
    if(!videoLocalPath|| !thumbnailLocalPath){
        if (videoLocalPath) fs.unlinkSync(videoLocalPath);
        if (thumbnailLocalPath) fs.unlinkSync(thumbnailLocalPath);
        throw new ApiError(400,"video and thumbnail are required")
    }
    await VideoQueue.add('publish-video',{
        user_id,
        title,
        description,
        videoLocalPath,
        thumbnailLocalPath
    });
 
    return res.status(202).json(
        new ApiResponse(202, {}, "Video upload queued, processing in background")
    );
})

const getVideoById=asynchandler(async(req,res)=>{
    const {video_id}=req.params
    if(!isValidObjectId(video_id)){
        throw new ApiError(400,"videoId is not valid")
    }
    const video=await Video.findById(video_id)
    if(!video){
        throw new ApiError(404,"video not found")
    }
    return res.status(200)
    .json(new ApiResponse(200,video,"video fetched secessfully"))
})

const updateVideo = asynchandler(async(req,res)=>{
    const {video_id}=req.params
     if(!isValidObjectId(video_id)){
        throw new ApiError(400,"videoId is not valid")
    }
    const user_id=req.user._id
    const video=await Video.findById(video_id)
    if(!video){
        throw new ApiError(404,"video not found")
    }
    if(!video.owner.equals(user_id)){
        throw new ApiError(403,"unauthorized")
    }
    const {title,description}=req.body
    const thumbnailLocalPath=req.file?.path
    if(thumbnailLocalPath){
        const thumbnail=await uploadOnCloudinary(thumbnailLocalPath)
      if(thumbnail){
        video.thumbnail=thumbnail.secure_url
    }
    }
    

    if(title?.trim()){
        video.title=title.trim()
    }
    if(description?.trim()){
        video.description=description.trim()
    }
  
    await video.save()
    return res.status(200)
    .json(new ApiResponse(200,video,"video updated successfully"))

})

const deleteVideo = asynchandler(async(req, res) => {
    const {video_id} = req.params;
    const user_id = req.user._id;

    if(!isValidObjectId(video_id)){
        throw new ApiError(400, "invalid videoId");    
    }

    const video = await Video.findById(video_id); 
    if(!video){ 
        throw new ApiError(404, "video not found"); 
    }

    if(!video.owner.equals(user_id)){ 
        throw new ApiError(403, "unauthorized access"); 
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      
        await Video.findByIdAndDelete(video_id, { session });
        await Comment.deleteMany({ video: video_id }, { session });
        await Like.deleteMany({ video: video_id }, { session });

        await Playlist.updateMany(
            { videos: video_id },
            { $pull: { videos: video_id } },
            { session }
        );

        //Cloudinary
        const videoPublicId = video.videoFile.split('/').pop().split('.')[0];
        const thumbnailPublicId = video.thumbnail.split('/').pop().split('.')[0];
    
        await Promise.all([
            deleteFromCloudinary(videoPublicId, "video"), 
            deleteFromCloudinary(thumbnailPublicId, "image") 
        ]);
  
        await session.commitTransaction();
        return res.status(200).json( 
            new ApiResponse(200, {}, "Video and associated data deleted successfully") 
        );

    } catch (error) {
        await session.abortTransaction();
        throw new ApiError(500, error?.message || "Failed to delete video and associated data");
    } finally {
        session.endSession();
    }
});

const togglePublishStatus=asynchandler(async(req,res)=>{
    const {video_id}=req.params
    const user_id=req.user._id
    if(!isValidObjectId(video_id)){
        throw new ApiError(400,"invalid videoId")
    }
    const video=await Video.findById(video_id)
    if(!video){
        throw new ApiError(404,"video not found")
    }
    if(!video.owner.equals(user_id)){
        throw new ApiError(403,"unathorized")
    }
    // if(video.isPublished){
    //     video.isPublished=false
    // }
    // else{
    //     video.isPublished=true
    // }
    video.isPublished=!video.isPublished
    await video.save()

    return res.status(200)
    .json(new ApiResponse(200,video,"status changed successfully"))
})

export {
    getVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}