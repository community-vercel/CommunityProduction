'use client'

import supabase from "@/lib/supabase";

async function uploadImage(refID, files, storage_name, storage_path) {
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
  const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const uploadResults = [];
  let localFile = [];
  if (files.name) localFile.push(files);
  else localFile = [...files];

  for (const file of localFile) {
    try {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        throw new Error(
          "File type not accepted. Please upload a JPEG, PNG, or WebP image."
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error("File size exceeds 3MB limit.");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${refID}-${Math.random()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(storage_name)
        .upload(`${storage_path}/${fileName}`, file);

      if (error) throw error;

      // Get the public URL of the uploaded file
      const {
        data: { publicUrl },
        error: urlError,
      } = supabase.storage
        .from(storage_name)
        .getPublicUrl(`${storage_path}/${fileName}`);

      if (urlError) throw urlError;

      uploadResults.push({
        fileName: file.name,
        url: publicUrl,
        status: "success",
      });
    } catch (error) {
      console.error("Error uploading image:", error.message);
      uploadResults.push({
        fileName: file.name,
        error: error.message,
        status: "error",
      });
    }
  }
  return uploadResults;
}

export default uploadImage