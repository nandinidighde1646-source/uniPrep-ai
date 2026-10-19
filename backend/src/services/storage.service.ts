

import { randomUUID } from "node:crypto";
import { Upload } from "tus-js-client";
import { supabase } from "../config/supabase.js";

const BUCKET_NAME = "study-materials";
const CHUNK_SIZE = 6 * 1024 * 1024;

export const uploadPdfToSupabase = async (
  file: Express.Multer.File,
  folder: "notes" | "pyqs"
): Promise<string> => {
  if (
    !file.buffer ||
    file.buffer.subarray(0, 5).toString() !== "%PDF-"
  ) {
    throw new Error("A valid PDF file is required.");
  }

  const filePath = `${folder}/${randomUUID()}.pdf`;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error("Supabase environment variables are missing.");
  }

const projectRef = "tkchdoeundnzrmhvsidp";

  await new Promise<void>((resolve, reject) => {
    const upload = new Upload(file.buffer, {
      endpoint: `https://${projectRef}.storage.supabase.co/storage/v1/upload/resumable`,
      chunkSize: CHUNK_SIZE,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      headers: {
        authorization: `Bearer ${supabaseSecretKey}`,
        apikey: supabaseSecretKey,
        "x-upsert": "false",
      },
      metadata: {
        bucketName: BUCKET_NAME,
        objectName: filePath,
        contentType: "application/pdf",
        cacheControl: "3600",
      },
      onError(error) {
        console.error("Supabase resumable upload failed:", error);
        reject(error);
      },
      onSuccess() {
        console.log("PDF uploaded successfully:", filePath);
        resolve();
      },
    });

    upload.start();
  });

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
};
