import asynchandler from "../utils/asynchandler.js";
import {Subscription} from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";

const toggleSubscribeStatus= asynchandler(async(req,res)=>{
    const {channel_id} =req.params
    const user_id=req.user._id
    if(!isValidObjectId(channel_id)){
        throw new ApiError(400,"invalid channel")
    }
    const subscribe =await Subscription.findOne({subscriber:user_id,channel:channel_id})
    if(!subscribe){
        const subscribed= await Subscription.create({
            subscriber:user_id,
            channel:channel_id
        })
        if(!subscribed){ throw new ApiError(500,"not subscribed successfully")}
        return res.status(201)
        .json(new ApiResponse((201),subscribed,"subscribed successfully"))
    }

    await subscribe.deleteOne()
    return res.status(200)
    .json(new ApiResponse(200,{},"unsubscribed successfully"))

})

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