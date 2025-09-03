import multer, { memoryStorage, FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

/**
 * Multer configuration for handling image uploads
 * Uses memory storage to avoid temporary file issues
 */
const upload: multer.Multer = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only allow 1 file per request
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Allowed file extensions
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif'];
    
    // Allowed MIME types
    const allowedMimeTypes = [
      'image/png', 
      'image/jpg', 
      'image/jpeg', 
      'image/svg+xml', 
      'image/webp', 
      'image/gif'
    ];
    
    const extension = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(extension) && allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

export default upload;
