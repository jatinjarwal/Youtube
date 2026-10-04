import asynchandler from "../utils/asynchandler.js";
import {Subscription} from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import {SubscriptionQueue} from '../queues/subscription.queue.js'

const toggleSubscribeStatus= asynchandler(async(req,res)=>{
    const {channel_id} =req.params
    const user_id=req.user._id

    if(!isValidObjectId(channel_id)){
        throw new ApiError(400,"invalid channel")
    }
    
   
    await SubscriptionQueue.add('toggle-sub', {
        user_id,
        channel_id,
    });

   
    return res.status(202).json(
        new ApiResponse(202, {}, "Subscription request queued successfully")
    );
});
    

    


const subscribedChannel =asynchandler(async(req,res)=>{
    const user_id =req.user._id
    const subscribed= await Subscription.aggregate([
        {
            $match:{
                subscriber:new mongoose.Types.ObjectId(user_id)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as: "channel",
                pipeline:[
                    {$project:{
                        _id:1,
                        username:1,
                        avatar:1
                
                    }}
                ]
            }
        },
        {
            $addFields:{
                  channel:{
                    $first:"$channel"
                  }
            }
        },
        {$project:{
            channel:1
        }}
    ])
    if(subscribed.length===0){
        return res.status(200)
        .json(new ApiResponse(200,subscribed,"no subscribed channel found"))
    }

    return res.status(200)
    .json(new ApiResponse(200,subscribed,"subscribed list fetched successfully"))
})


export{
    toggleSubscribeStatus,
    subscribedChannel
}