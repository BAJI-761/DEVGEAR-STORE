import { v2 as cloudinary } from 'cloudinary';

let cloudinaryConfigured = false;

export function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    cloudinaryConfigured = false;
    return false;
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true
  });

  cloudinaryConfigured = true;

  return true;
}

export function isCloudinaryConfigured() {
  return cloudinaryConfigured;
}

export { cloudinary };