import asynchandler from "../utils/asynchandler.js"
import {Video} from "../models/video.model.js"
import{Subscription} from "../models/subscription.model.js"
import{Tweet} from "../models/tweet.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"




const channelStats = asynchandler(async(req,res)=>{
    const user_id=req.user._id
    
    const videosCount= await Video.countDocuments({owner:user_id})

    const subscribersCount= await Subscription.countDocuments({channel:user_id})

    const tweetsCount = await Tweet.countDocuments({owner:user_id})
    
    return res.status(200)
    .json(new ApiResponse(200,{videosCount,subscribersCount,tweetsCount},"stats fetched successfully"))

})

const channelVideos= asynchandler(async(req,res)=>{
    const user_id=req.user._id

    const videos=await Video.find({owner:user_id})
   

    return res.status(200)
    .json(new ApiResponse(200,videos,videos.length? "videos fetched successfully":"no video found"))
})

export{
    channelStats,
    channelVideos
}