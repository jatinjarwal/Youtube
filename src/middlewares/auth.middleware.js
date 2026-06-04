import asynchandler from "../utils/asynchandler.js";
import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";

export const verifyJWT = asynchandler(async (req, _, next) => {
  try {
      const token =req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
      if(!token){
          throw new ApiError(401, "Unauthorized: No token provided");
      }
      const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedtoken?._id).select("-password -refreshToken");
      if(!user){
          throw new ApiError(401, "Unauthorized: Invalid token");
      }
      req.user = user;
      next();
  } catch (error) {
      throw new ApiError(401, "Unauthorized: Invalid token");   
  }
});
