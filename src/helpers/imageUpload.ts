import cloudinary from './cloudinary';

export interface ImageUploadOptions {
  folder?: string;
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
}

export interface ImageUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Supported image input types
 */
export type ImageInput = 
  | Buffer                    // Multer file buffer
  | string                    // Base64 string or data URL
  | Uint8Array               // Typed array
  | ArrayBuffer              // Array buffer from blob
  | { buffer: Buffer }       // Multer file object
  | { data: string }         // Base64 data object

/**
 * Convert various image input formats to Buffer
 * @param input - Image data in various formats
 * @returns Buffer ready for upload
 */
const normalizeImageInput = (input: ImageInput): Buffer => {
  // Handle Buffer (most common from multer)
  if (Buffer.isBuffer(input)) {
    return input;
  }
  
  // Handle multer file object
  if (typeof input === 'object' && input !== null && 'buffer' in input && Buffer.isBuffer(input.buffer)) {
    return input.buffer;
  }
  
  // Handle base64 data object
  if (typeof input === 'object' && input !== null && 'data' in input && typeof input.data === 'string') {
    return normalizeImageInput(input.data);
  }
  
  // Handle string (base64 or data URL)
  if (typeof input === 'string') {
    // Check if it's a data URL (data:image/jpeg;base64,...)
    if (input.startsWith('data:')) {
      const base64Data = input.split(',')[1];
      if (!base64Data) {
        throw new Error('Invalid data URL format');
      }
      return Buffer.from(base64Data, 'base64');
    }
    
    // Handle plain base64 string
    try {
      return Buffer.from(input, 'base64');
    } catch (error) {
      throw new Error('Invalid base64 string format');
    }
  }
  
  // Handle Uint8Array (from blob.arrayBuffer())
  if (input instanceof Uint8Array) {
    return Buffer.from(input);
  }
  
  // Handle ArrayBuffer (from blob.arrayBuffer())
  if (input instanceof ArrayBuffer) {
    return Buffer.from(input);
  }
  
  throw new Error('Unsupported image input format. Supported: Buffer, base64 string, data URL, Uint8Array, ArrayBuffer, or multer file object');
};

/**
 * Upload image to Cloudinary with support for multiple input formats
 * @param input - Image data in various formats (Buffer, base64, blob data, etc.)
 * @param options - Upload configuration options
 * @returns Promise<ImageUploadResult>
 */
export const uploadImageToCloudinary = async (
  input: ImageInput,
  options: ImageUploadOptions = {}
): Promise<ImageUploadResult> => {
  const {
    folder = 'my_brand_blog/posts',
    width = 1200,
    height = 630,
    quality = 'auto',
    format = 'auto'
  } = options;

  try {
    // Normalize input to Buffer
    const buffer = normalizeImageInput(input);
    
    // Validate buffer size (basic check)
    if (buffer.length === 0) {
      throw new Error('Image buffer is empty');
    }
    
    // Check if buffer size exceeds 10MB
    if (buffer.length > 10 * 1024 * 1024) {
      throw new Error('Image size exceeds 10MB limit');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { quality },
            { fetch_format: format },
            { width, height, crop: 'limit' }
          ]
        }, (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
              bytes: result.bytes
            });
          } else {
            reject(new Error('Unknown error during image upload'));
          }
        }
      );
      
      uploadStream.end(buffer);
    });
  } catch (error) {
    throw new Error(`Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns Promise<boolean>
 */
export const deleteImageFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
};

/**
 * Convenience function to handle image upload from Express request
 * Supports only two fields: image (File) and imageUrl (string)
 * @param req - Express request object
 * @param options - Upload configuration options
 * @returns Promise<string | undefined> - Image URL or undefined if no image
 */
export const handleRequestImageUpload = async (
  req: any, // Express request
  options: ImageUploadOptions = {}
): Promise<string | undefined> => {
  // Priority 1: Check for file upload (multer) - image field
  if (req.file && req.file.buffer) {
    const result = await uploadImageToCloudinary(req.file.buffer, options);
    return result.url;
  }
  
  // Priority 2: Check for imageUrl string field
  if (req.body.imageUrl && typeof req.body.imageUrl === 'string' && req.body.imageUrl.trim()) {
    return req.body.imageUrl.trim();
  }
  
  return undefined;
};
