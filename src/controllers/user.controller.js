import asynchandler from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


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
        coverImage:coverImage?.url || "",
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
     { $set: {
        refreshToken: undefined
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

export { registerUser, loginUser,logoutUser };