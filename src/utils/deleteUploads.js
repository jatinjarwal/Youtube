import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import { ApiError } from './ApiError.js';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const deleteFromCloudinary = async (publicId,resourceType="image") => {
  
   try {
     if (!publicId) {
       throw new ApiError(400, "Public ID is required");
     }
     const result = await cloudinary.uploader.destroy(publicId,{
      resource_type:resourceType
     });
     return result;
   
   } catch (error) {
      console.log("deletion failed",error);
      throw new ApiError(500, "Failed to delete asset from Cloudinary");
   }
};
export { deleteFromCloudinary };