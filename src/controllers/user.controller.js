import asynchandler from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
        new ApiResponse(201, "User registered successfully", userCreated)
    );
});

const loginUser = asynchandler(async (req, res) => {
    
});

export { registerUser, loginUser };