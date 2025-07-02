"use server";

import supabaseServer from "~/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function uploadImageToSupabase(file: File) {
  const supabase = await supabaseServer();
  const fileExtension = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `product_images/${fileName}`;

  const { data, error } = await supabase.storage
    .from("images") // Ensure you have a bucket named 'images' in Supabase Storage
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading image:", error);
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
