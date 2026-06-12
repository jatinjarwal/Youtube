import aysnchandelr from "../utils/asynchandler"
import {Like} from "../models/like.model"
import{Video} from "../models/video.model"
import{Comment} from "../models/comment.model"
import{Tweet} from "../models/tweet.model"
import {ApiError} from "../utils/ApiError"
import {ApiResponse} from "../utils/ApiResponse"
import mongoose from "mongoose"
import asyncHandler from "../utils/asynchandler"



const videoLike= aysnchandler(async(req,res)=>{
    const {video_id}=req.params
    const user_id= req.user._id
    const video=await Video.findById(video_id)
    if(!video){
        throw new ApiError(404,"video not found")
    }

     const like= await Like.findOne(
        {likedby:user_id,
        video:video_id
        })

     if(!like){
       const liked= await Like.create({
            video:video_id,
            tweet:null,
            comment:null,
            likedby:user_id
        })
        return res.status(201)
        .json(new ApiResponse(201,liked,"liked successfully"))
     }

     
        await like.deleteOne()
        return res.status(200)
        .json(new ApiResponse(200,{},"unliked successfully"))
     
    

})

const commentLike= aysnchandler(async(req,res)=>{
    const {comment_id}=req.params
    const user_id= req.user._id
    const comment=await Comment.findById(comment_id)
    if(!comment){
        throw new ApiError(404,"comment not found")
    }

     const like= await Like.findOne(
        {likedby:user_id,
        comment:comment_id
        })

     if(!like){
       const liked= await Like.create({
            video:null,
            tweet:null,
            comment:comment_id,
            likedby:user_id
        })
        return res.status(201)
        .json(new ApiResponse(201,liked,"liked successfully"))
     }

     
        await like.deleteOne()
        return res.status(200)
        .json(new ApiResponse(200,{},"unliked successfully"))
     
    

})

const tweetLike= aysnchandler(async(req,res)=>{
    const {tweet_id}=req.params
    const user_id= req.user._id
    const tweet=await Tweet.findById(tweet_id)
    if(!tweet){
        throw new ApiError(404,"tweet not found")
    }

     const like= await Like.findOne(
        {likedby:user_id,
        tweet:tweet_id
        })

     if(!like){
       const liked= await Like.create({
            video:null,
            tweet:tweet_id,
            comment:null,
            likedby:user_id
        })
        return res.status(201)
        .json(new ApiResponse(201,liked,"liked successfully"))
     }

     
        await like.deleteOne()
        return res.status(200)
        .json(new ApiResponse(200,{},"unliked successfully"))
     
    

})

const getLikedVideos= asyncHandler(async(req,res)=>{
        const user_id=req.user._id

        const likedvideos= await Like.aggregate([
            {
                $match:{
                    likedby:new mongoose.Types.ObjectId(user_id)
                }
            },
            {
                $lookup:{
                    from:"videos",
                    localField:"video",
                    foreignField:"_id",
                    as: "video" ,
                    pipeline:[{
                        $project:{
                            videoFile:1,
                            thumbnail:1,
                            title:1,
                            
                        }
                    }]
                }
            },{
                $addFields:{
                    video:{
                        $first:"$video"
                    }
                }
            },
            {
                $project:{
                    video:1
                }
            }
        ])

        if(likedvideos.length==0){
            throw new ApiError(404,"no liked videos")
        }

        return res.status(200)
        .json(new ApiResponse(200,likedvideos,"vidoe fetched successfully"))
})


export{
    videoLike,
    commentLike,
    tweetLike,
    getLikedVideos
}