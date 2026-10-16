
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";

const createPdfUploader = (folder: string) => {
  const uploadDirectory = path.resolve(`uploads/${folder}`);

  fs.mkdirSync(uploadDirectory, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
      callback(null, uploadDirectory);
    },
    filename: (_req, _file, callback) => {
      callback(null, `${randomUUID()}.pdf`);
    },
  });

  const fileFilter: multer.Options["fileFilter"] = (
    _req,
    file,
    callback
  ) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (extension !== ".pdf" || file.mimetype !== "application/pdf") {
      callback(new Error("Only PDF files are allowed."));
      return;
    }

    callback(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 1,
    },
  });
};

export const uploadNotePdf = createPdfUploader("notes");
export const uploadPYQPdf = createPdfUploader("pyqs");
