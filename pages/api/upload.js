import cloudinary from "cloudinary";
import multiparty from "multiparty";
import { isAdminRequest } from "./auth/[...nextauth]";
import dbConnect from './../../lib/mongoose';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handle(req, res) {
  
  await dbConnect();
  await isAdminRequest(req, res)

  const form = new multiparty.Form();
  const { files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const uploadedImages = [];

  try {
    for (const file of files.files) {
      const filePath = file.path;
      const uploadResponse = await cloudinary.v2.uploader.upload(filePath);
      uploadedImages.push(uploadResponse.secure_url); // Store image URL
    }

    res.json({ links: uploadedImages }); // Return all uploaded images
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
}

export const config = {
  api: { bodyParser: false },
};
