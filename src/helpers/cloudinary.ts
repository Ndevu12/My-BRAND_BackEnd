import { v2 as cloudinary } from 'cloudinary' 

    const cloud_name = process.env.CLOUDINARY_NAME;
    const api_key = process.env.CLOUDINARY_API_KEY;
    const api_secret = process.env.CLOUDINARY_API_SECRET; 

if (!cloud_name || !api_key || !api_secret) {
  throw new Error('CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET variables are not defined in env.')
}

cloudinary.config({ 
    cloud_name: cloud_name, 
    api_key: api_key, 
    api_secret: api_secret
  });

export default cloudinary;