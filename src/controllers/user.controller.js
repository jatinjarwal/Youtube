import asynchandler from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteUploads.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";



const generateAccessRefreshTokens = async (userId) => {
    try {           
    
    const user= await User.findById(userId);
   
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
}
catch (error) {
   console.error("Error generating tokens:", error);
   throw new ApiError(500, "Failed to generate tokens");
    
} 
 }

const registerUser = asynchandler(async (req, res) => {
    const { username, fullName, email, password } = req.body;
    console.log("email", email);
    if(!fullName){
        throw new ApiError(400, "Full name is required");
    }
    else if(!email){
        throw new ApiError(400, "Email is required");
    }
    else if(!password){ 
        throw new ApiError(400, "Password is required");
    }
    else if(!username){
        throw new ApiError(400, "Username is required");
    }

    const userExists=await User.findOne({email});

    if(userExists){
        throw new ApiError(400, "User already exists with this email");
    }

   const avatarLocalPath = req.files?.avatar?.[0]?.path;
   const coverImageLocalPath = req.files?.coverImage?.[0]?.path;


if(!avatarLocalPath){
    throw new ApiError(400, "Avatar is required");  
}

    const avatar= await uploadOnCloudinary(avatarLocalPath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);


    if(!avatar){
        throw new ApiError(400, "Avatar is required");
    }


    const user=await User.create({
        username,
        fullName,
        email,
        password,
        avatar:avatar.url,
        avatarPublicId:avatar.public_id,
        coverImage:coverImage?.url || "",
        coverImagePublicId:coverImage?.public_id || ""
    });


    const userCreated= await User.findById(user._id).select("-password -refreshToken");


    if(!userCreated){
        throw new ApiError(500, "Failed to register user");
    }


   return res.status(201).json(
        new ApiResponse(201, userCreated, "User registered successfully")
    );
});

const loginUser = asynchandler(async (req, res) => {
    const {email,password,username}=req.body;
     if(!email && !username){
        throw new ApiError(400, "Email or username is required");
     }
        if(!password){  
        throw new ApiError(400, "Password is required");
     }
     const user=await User.findOne({
        $or:[
            {email},
            {username}
        ]
     });
     if(!user){
        throw new ApiError(404, "User not found");
     }
     const isPasswordValid=await user.checkpassword(password);
     if(!isPasswordValid){
        throw new ApiError(401, "Invalid credentials");
     }
       
        const {accessToken, refreshToken}= await generateAccessRefreshTokens(user._id);
        const loggedInUser=await User.findById(user._id).select("-password -refreshToken");

        const options={
            httpOnly:true,
            secure:true};

          return  res.status(200).
            cookie("refreshToken", refreshToken, options).
            cookie("accessToken", accessToken, options).
            json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));


});

const logoutUser = asynchandler(async (req, res) => {   
  await  User.findByIdAndUpdate(req.user._id,
     { $unset: {
        refreshToken: 1
    } },
    { new: true, runValidators: false }) ;
    const options={
        httpOnly:true,
        secure:true
    };
    return res.status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));


 });

 const refreshAccessToken = asynchandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }
   try {
     const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
     const user=await User.findById(decodedToken._id);
     if (!user || user.refreshToken !== incomingRefreshToken) {
         throw new ApiError(401, "Invalid refresh token");
     }
     const { accessToken, refreshToken } = await generateAccessRefreshTokens(user._id);
     const options = {
         httpOnly: true,
         secure: true
     };
     return res.status(200)
         .cookie("refreshToken", refreshToken, options)
         .cookie("accessToken", accessToken, options)
         .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed successfully"));  
 
 
   } catch (error) {
    throw new ApiError(401, error?.message||"Invalid refresh token");
   }
});

const updateUserPassword = asynchandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isPasswordValid = await user.checkpassword(currentPassword);

    if (!isPasswordValid) {
        throw new ApiError(400, "Current password is incorrect");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"));
});

const getCurrentUser = asynchandler(async (req,res)=>{
    const user = await User.findById(req.user._id).select("-pasword -refreshToken");
    if(!user){
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200,user,"User fetched successfully"));
})

const updateUserDetails  = asynchandler(async (req,res)=>{
    const { fullName,username}=req.body;
    if(!fullName || !username){
        throw new ApiError(400, "Full name and username are required");
    }
    const updatedUser= await User.findByIdAndUpdate(req.user._id,{
      $set: {
        fullName,
        username
      }
    },{new:true})

    if(!updatedUser){
        throw new ApiError(404, "User not found");
    }
    return res.status(200)
    .json(new ApiResponse(200, updatedUser, "User details updated successfully"));
});

const updateUserAvatar= asynchandler(async (req,res)=>{
    const avatarLocalPath= req.file?.path;
    const publicId=req.user.avatarPublicId;


    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required");
    }

    const avatar = await upLoadOnCloudinary(avatarLocalPath);
    if(!avatar||!avatar.url){
        throw new ApiError(500,"failed to upload avatar on cloudinary");    
    }

    const updatedUseravater= await User.findByIdAndUpdate(req.user._id,{
        $set:{
            avatar:avatar.url,
            avatarPublicId:avatar.public_id
        },
        
    },{new:true }).select("-password -refreshToken");
    

    if(!updatedUseravater){
        throw new ApiError(404, "User not found");
    }


  
    
        await deleteFromCloudinary(publicId);
   


   
    return res.
    status(200).
    json(new ApiResponse(200, updatedUseravater, "User avatar updated successfully"));
})

const updateUserCoverImage= asynchandler(async (req,res)=>{
    const coverImageLocalPath= req.file?.path;  
    if(!coverImageLocalPath){
        throw new ApiError(400, "Cover image is required");
    }
    const coverImage = await upLoadOnCloudinary(coverImageLocalPath);
    if(coverImage||!coverImage.url){
        throw new ApiError(500,"failed to upload cover image on cloudinary");    
    }
    const updatedUsercoverImage= await User.findByIdAndUpdate(req.user._id,{
        $set:{
            coverImage:coverImage.url
        },
        
    },{new:true }).select("-password -refreshToken");
    if(!updatedUsercoverImage){
        throw new ApiError(404, "User not found");
    }
    return res.
    status(200).
    json(new ApiResponse(200, updatedUsercoverImage, "User cover image updated successfully"));
})

const getUserChannelProfile = asynchandler(async (req,res)=>{
    const {username}= req.params;
    const _id=new mongoose.Types.ObjectId(req.user._id);
    if(!username){
        throw new ApiError(400 , "no channel found");
    }
    const channel = await User.aggregate([
        {
          $match:{
            username:username?.toLowerCase()
          }
    },
    {
        $lookup:{
         from:"subscriptions",
         localField:"_id",
         foreignField:"channel",
         as: "subscribers"
            
        }
    },
    {
        $lookup:{
            from: "subscriptions",
            localField:"_id",
            foreignField:"subscriber",
            as: "subscribed"
        }
    },
    {
        $addFields:{
            subsCount:{
                $size:"$subscribers"
            },
            subscribedCount:{
                $size:"$subscribed"
            },
            isSubscribed:{
                $cond:{
                    if:{$in:[_id,"$subscribers.subscriber"]},
                    then:true,
                    else:false
                }
            }
        }
    },{
        $project:{
            fullName:1,
            username:1,
            subsCount:1,
            subscribedCount:1,
            isSubscribed:1,
            avatar:1,
            coverImage:1
            
    }
}
])
    if(!channel || channel.length===0){
        throw new ApiError(404, "Channel not found");
    }
    return res.status(200)
    .json(new ApiResponse(200,channel[0],"Channel profile fetched successfully"));

    



})

const getWatchHistory= asynchandler(async(req,res)=>{
    const user=  await User.aggregate([

        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }


        },
        {
            $lookup:{
                from: "videos",
                localField:"watchHistory",
                foreignField:"_id",
                as: "watchHistory",
                    pipeline:[
                        {
                            $lookup:{
                                from:"users",
                                localField:"owner",
                                foreignField:"_id",
                                as:"owner",
                                         pipeline:[
                                      {
                                        $project:{
                                            username:1,
                                            fullName:1,
                                            avatar:1
                                        }
                                    }
                                ]
                               
                            }
                        },
                        {
                                            
                    $addFields:{
                            owner:{
                            $first:"$owner"
                             }
                     }
                                    
                                
                        }
                    ]
            }
        }
    ])
    return res.status(200)
    .json(new ApiResponse(200,user[0].watchHistory,"watchHistory fetched successfully") )

    
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updateUserPassword,
    getCurrentUser,
    updateUserDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
};