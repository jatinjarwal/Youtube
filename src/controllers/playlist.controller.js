import asynchandler from "../utils/asynchandler.js"
import mongoose ,{isValidObjectId}from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"



const createPlaylist= asynchandler(async(req,res)=>{
    const{name,description}=req.body
    const user_id=req.user._id
    if(!name?.trim()){
        throw new ApiError(400,"name and description are required")
    }
    const playlist= await Playlist.create({
        name,
        description,
        owner:user_id

    })
     const createdPlaylist= await Playlist.findById(playlist._id)
     

    if(!createdPlaylist){
        throw new ApiError(500,"playlist not created")
    }

    return res.status(201)
    .json(new ApiResponse(201,createdPlaylist,"playlist created successfully"))
})

const addVideo=asynchandler(async(req,res)=>{
    const {video_id,playlist_id}=req.params
    const user_id=req.user._id
    

    if(!isValidObjectId(video_id) || !isValidObjectId(playlist_id)){
        throw new ApiError(400,"invalid ids")
    }
    const playlist=await Playlist.findById(playlist_id)
    if(!playlist){
        throw new ApiError(404,"playlsit not found")
    }
    if(!playlist.owner.equals(user_id)){
        throw new ApiError(403,"unauthorized")
    }
    const isExist= playlist.videos.some(
        (video)=>
           {  return video.equals(video_id)
      } )

    if(isExist){
        throw new ApiError(400,"video is already added")
    }
   playlist.videos.push(video_id)
   await playlist.save()

   return res.status(200)
   .json(new ApiResponse(200,{},"video added successfully"))


})

const removeVideo= asynchandler(async(req,res)=>{

    const {video_id,playlist_id}=req.params
    const user_id=req.user._id
    

    if(!isValidObjectId(video_id) || !isValidObjectId(playlist_id)){
        throw new ApiError(400,"invalid ids")
    }
    const playlist=await Playlist.findById(playlist_id)
    if(!playlist){
        throw new ApiError(404,"playlsit not found")
    }
    if(!playlist.owner.equals(user_id)){
        throw new ApiError(403,"unauthorized")
    }
    const isExist= playlist.videos.some(
        (video)=>
           {  return video.equals(video_id)
      } )

    if(!isExist){
        throw new ApiError(404,"video is not in playlist")
    }
 playlist.videos.pull(video_id)
   
   
   await playlist.save()

   return res.status(200)
   .json(new ApiResponse(200,{},"video removed successfully"))


})

const getUserPlaylists= asynchandler(async(req,res)=>{
     const user_id=req.user._id
     const playlists= await Playlist.find({owner:user_id}).select("_id name")
     if(!playlists[0]){
        return res.status(200)
        .json( new ApiResponse(200,[],"no playlist found"))
     }

     return res.status(200)
     .json(new ApiResponse(200,playlists,"playlists fetched successfully"))
        
     
})

const getPlaylistById=asynchandler(async(req,res)=>{
    const {playlist_id} =req.params

       if( !isValidObjectId(playlist_id)){
        throw new ApiError(400,"invalid playlist")
    }
    const playlist= await Playlist.findById(playlist_id).select("-owner")
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }
    return res.status(200)
    .json(new ApiResponse(200,playlist,"playlist fetched successfully"))
})

const deletePlaylist=asynchandler(async(req,res)=>{
    const{playlist_id}=req.params
    const user_id=req.user._id
    if(!isValidObjectId(playlist_id)){
        throw new ApiError(400,'invalid id')
    }
   

    const playlist=await Playlist.findById(playlist_id)
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }
    if(!playlist.owner.equals(user_id)){
        throw new ApiError(403,"unauthorized")
    }

    await playlist.deleteOne()

    return res.status(200)
    .json(new ApiResponse(200,{},"playlist deleted successfully"))
    
})

const updatePlaylist=asynchandler(async(req,res)=>{
    const {playlist_id}=req.params
    const {name,description}=req.body
    const user_id=req.user._id
    if(!name?.trim()){
        throw new ApiError(400,"name is required")
    }
    
    if(!isValidObjectId(playlist_id)){
        throw new ApiError(400,"invalid id")
    }
    const playlist= await Playlist.findById(playlist_id)
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }
    if(!playlist.owner.equals(user_id)){
        throw new ApiError(403,"unauthorized")
    }
    playlist.name=name.trim()
    if(description?.trim()){playlist.description=description.trim()}
    await playlist.save()

    return res.status(200)
    .json(new ApiResponse(200,playlist,"playlist updated successfully"))
})

export{
   createPlaylist,
   getPlaylistById,
   getUserPlaylists,
   deletePlaylist,
   updatePlaylist,
   addVideo,
   removeVideo
}