import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

export const createUploader = ({ folder, formats, fileSize = 1 }) => {

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: formats
    }
  });

  return multer({
    storage,
    limits: {
      fileSize: fileSize * 1024 * 1024
    }
  });
};