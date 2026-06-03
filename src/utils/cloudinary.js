import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadOnCloudinary = async (localFilePath) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath,{
        resource_type: 'auto'
    });
    console.log('Upload successful:', result.url);
    fs.unlinkSync(localFilePath); // Delete the file from local storage
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    fs.unlinkSync(localFilePath); // Delete the file from local storage
    throw error;
  }
};
export { uploadOnCloudinary };