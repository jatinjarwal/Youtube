import {Tweet} from "../models/tweet.model"
import {asynchandler} from "../utils/asynchandler"
import { ApiError } from "../utils/ApiError"
import {ApiResponse} from "../utils/ApiResponse"
import mongoose from "mongoose"

const createTweet= asynchandler(async(req,res)=>{
    const {content}=req.body
    const userId=req.user._id
    if(!content){
        throw new ApiError(400,"content is required")
    }
    const createdTweet=await Tweet.create({
        content:content,
        owner:userId
    },)

    if(!createdTweet){
        throw new ApiError(500,"tweet not created")
    }
    return res.status(201)
    .json(new ApiResponse(201,createdTweet,"tweet created successfully"))
})

const getUserTweets= asynchandler(async(req,res)=>{
  
    const userTweets= await Tweet.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $project:{
                content:1
            }
        }
    ])
    if(userTweets.length==0){
        throw new ApiError(404,"no tweets found")
    }
    return res.status(200)
    .json(new ApiResponse(200,userTweets,"tweets fetched successfully"))
})

const updateTweet= asynchandler(async(req,res)=>{
    const {tweet_id}=req.params
    const tweet= await Tweet.findById(tweet_id)
    if(!tweet){
        throw new ApiError(404,"tweet not found")
    }
    if(tweet.owner.toString()!==req.user._id.toString()){
        throw new ApiError(403,"unauthorized")
    }
    const {content}=req.body
    if(!content?.trim()){
     throw new ApiError(400,"content is required")
    }
    if(content.trim()===tweet.content){
        throw new ApiError(400,"new content must be different from old")
    }

 tweet.content=content.trim()
   const updatedTweet= await tweet.save();


    return res.status(200)
    .json(new ApiResponse(200,updatedTweet,"updated successfully"))
    

})

const deleteTweet= asynchandler(async(req,res)=>{
    const {tweet_id}=req.params
    const tweet = await Tweet.findById(tweet_id)
    if(!tweet){
        throw new ApiError(404,"tweet not found")
    }
    if(req.user._id.toString()!==tweet.owner.toString()){
        throw new ApiError(403,"unauthorized")
    }

    await tweet.deleteOne()

    return res.status(200)
    .json(new ApiResponse(200,{},"tweet deleted succuessfully"))
})

export{
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}