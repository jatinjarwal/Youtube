import {Comment} from "../models/comment.model.js"
import  asyncHandler  from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose"




const viewComment =asyncHandler(async(req,res)=>{
     const {_id}= req.params;


    const  aggregateComments=  Comment.aggregate([
        {
            $match:{
                video:new mongoose.Types.ObjectId(_id)
            }
        },
        {
            $lookup:{
                from :"users",
                localField:"owner",
                foreignField:"_id",
                as :"owner",
                pipeline:[{
                    $project:{
                        username :1,
                        avatar:1


                    }
                }]
            }
            
        },
        {
             $addFields:{
                        owner:{
                            $first:"$owner"
                        }
                    }
        },
        {$project:{
            content:1,
            owner:1
        }}


     ])
     const options ={
       page: req.query.page ||1,
       limit:req.query.limit||10
     };
     const comments = await Comment.aggregatePaginate(aggregateComments,options)
    

     
     return res.status(200)
     .json(new ApiResponse(200,comments,comments.docs.length?"comments fetched successfully" :"No comments on this video"))
})

const addComment= asyncHandler(async(req,res)=>{
    const {content}= req.body
    const owner= req.user._id;
    const {video_id }= req.params
    const comment = await Comment.create({
        content:content,
        video:video_id,
        owner:owner
    })
     if(!comment?.trim()){
    throw new ApiError(500,"error while adding comment")
   }

   return res.status(201)
   .json(new ApiResponse(201,comment,"commente added successfully"))
})

const updateComment=asyncHandler(async(req,res)=>{
    const {content}=req.body
    const {comment_id}=req.params
    const updatedComment= await Comment.findByIdAndUpdate(comment_id,{
        $set:{
            content:content
        }
    },{new:true,runValidators:true})

    if(!updatedComment){
        throw new ApiError(404,"comment not updated")
    }

    return res.status(200)
    .json(new ApiResponse(200,updatedComment,"comment updated successfully"))
})

const deleteComment =asyncHandler(async(req,res)=>{
    const {comment_id}= req.params
    const comment=await Comment.findById(comment_id)
    if(!comment){
        throw new ApiError(404,"comment not found")
    }
    const userid =req.user._id.toString()
    const owner=comment.owner.toString()
    if(userid!==owner){
        throw new ApiError(403,"not allowed")
    }

     await comment.deleteOne()

  
    return res.status(200)
    .json(new ApiResponse(200,{},"comment deleted succussfully"))
})      
  
export {
    viewComment,
    addComment,
    updateComment,
    deleteComment
}