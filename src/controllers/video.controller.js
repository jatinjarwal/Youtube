import asynchandler from "../utils/asynchandler"
import {Video} from "../models/video.model"
import {ApiError} from "../utils/ApiError"
import {ApiResponse} from "..//utils/ApiResponse"
import mongoose from "mongoose"
import { isValidObjectId } from "mongoose"
import { uploadOnCloudinary } from "../utils/cloudinary"



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
    if(!title?.trim()){
        throw new ApiError(400,"title is required")
    }
    const videoLocalPath=req.files?.videoFile?.[0]?.path
    
    const thumbnailLocalPath=req.files?.thumbnail?.[0]?.path
    if(!videoLocalPath|| !thumbnailLocalPath){
        throw new ApiError(400,"video and thumbnail are required")
    }
    const videoFile=await uploadOnCloudinary(videoLocalPath)
    if(!videoFile){
        throw new ApiError(500,"video not uploaded on cloudinary")
    }
    const thumbnail=await uploadOnCloudinary(thumbnailLocalPath)
     if(!thumbnail){
        throw new ApiError(500,"thumbnail not uploaded on cloudinary")
    }
    const video= await Video.create({
        videoFile:videoFile.secure_url,
        thumbnail:thumbnail.secure_url,
        owner:req.user._id,
        title:title.trim(),
        description:description?.trim()||"",
        isPublished:true
    })

    const videoAdded= await Video.findById(video._id)
    if(!videoAdded){
        throw new ApiError(500,"video not added in mongodb")
    }

    return res.status(201)
    .json(new ApiResponse(201,videoAdded,"video added successfully"))

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

const deleteVideo= asynchandler(async(req,res)=>{
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
        throw new ApiError(403,"unauthorized access")
    }
    await video.deleteOne()

    return res.status(200)
    .json(new ApiResponse(200,{},"video deleted successfully"))
})

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