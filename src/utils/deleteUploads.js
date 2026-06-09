import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const deleteFromCloudinary = async (publicId) => {
  
   try {
     if (!publicId) {
       throw new ApiError(400, "Public ID is required");
     }
     const result = await cloudinary.uploader.destroy(publicId);
     return result;
   
   } catch (error) {
      console.log("deletion failed",error);
      return null
   }
};
export { deleteFromCloudinary };