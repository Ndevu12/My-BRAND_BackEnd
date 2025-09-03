import { Request, Response, NextFunction } from 'express';
import response from '../helpers/response';

/**
 * Middleware to handle multer upload errors gracefully
 */
export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err) {
    console.error('Upload error:', err);
    
    // Handle specific multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      response(res, 400, 'File too large. Maximum size is 10MB.', null, 'FILE_TOO_LARGE');
      return;
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      response(res, 400, 'Too many files. Only 1 file allowed.', null, 'TOO_MANY_FILES');
      return;
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      response(res, 400, 'Unexpected field name. Use "image" field.', null, 'UNEXPECTED_FIELD');
      return;
    }
    
    if (err.message && err.message.includes('Invalid file type')) {
      response(res, 400, err.message, null, 'INVALID_FILE_TYPE');
      return;
    }
    
    // Generic upload error
    response(res, 400, `File upload error: ${err.message}`, null, 'UPLOAD_ERROR');
    return;
  }
  
  next();
};
