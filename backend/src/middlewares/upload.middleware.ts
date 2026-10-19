
import multer from "multer";
import path from "node:path";

const createPdfUploader = (maxFiles = 1) => {
  const fileFilter: multer.Options["fileFilter"] = (
    _req,
    file,
    callback
  ) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (
      extension !== ".pdf" ||
      file.mimetype !== "application/pdf"
    ) {
      callback(new Error("Only PDF files are allowed."));
      return;
    }

    callback(null, true);
  };

  return multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: maxFiles,
    },
  });
};

export const uploadNotePdf = createPdfUploader();
export const uploadPYQPdf = createPdfUploader();


export const uploadBulkPYQFiles = multer({
  storage: multer.memoryStorage(),

  fileFilter: (_req, file, callback) => {
    if (file.fieldname === "csv") {
      const extension = path.extname(file.originalname).toLowerCase();

      if (
        extension !== ".csv" ||
        ![
          "text/csv",
          "application/vnd.ms-excel",
          "application/csv",
          "text/plain",
        ].includes(file.mimetype)
      ) {
        callback(new Error("Please upload a valid CSV file."));
        return;
      }

      callback(null, true);
      return;
    }

    if (file.fieldname === "pdfs") {
      const extension = path.extname(file.originalname).toLowerCase();

      if (
        extension !== ".pdf" ||
        file.mimetype !== "application/pdf"
      ) {
        callback(new Error("Only PDF files are allowed."));
        return;
      }

      callback(null, true);
      return;
    }

    callback(new Error("Unexpected upload field."));
  },

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 21,
  },
});
