import { Request, Response } from "express";
import * as pyqService from "../services/pyqs.service.js";
import { uploadPdfToSupabase } from "../services/storage.service.js";
import { parse } from "csv-parse/sync";

// Get all PYQs
export const getAllPYQs = async (
  req: Request,
  res: Response
) => {
  try {
    const pyqs = await pyqService.getAllPYQs();

    res.status(200).json({
      success: true,
      data: pyqs,
    });
  } catch (error: any) {
  console.error("Create PYQ Error:", error);

  res.status(500).json({
    success: false,
    message: "Failed to create PYQ",
    error: error?.message || error,
  });
}
};

// Get PYQ by ID
export const getPYQById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const pyq = await pyqService.getPYQById(id);

    if (!pyq) {
      return res.status(404).json({
        success: false,
        message: "PYQ not found",
      });
    }

    res.status(200).json({
      success: true,
      data: pyq,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch PYQ",
    });
  }
};

// Create PYQ


export const createPYQ = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, subject, semester, branch, year } = req.body;

    const fileUrl = req.file
      ? await uploadPdfToSupabase(req.file, "pyqs")
      : req.body.fileUrl;

    if (
      !title ||
      !subject ||
      !semester ||
      !branch ||
      !year ||
      !fileUrl
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, subject, semester, branch, exam year, and PDF are required.",
      });
    }

    const pyq = await pyqService.createPYQ({
      title,
      subject,
      semester: Number(semester),
      branch,
      year: Number(year),
      fileUrl,
    });

    return res.status(201).json({
      success: true,
      data: pyq,
    });
  } catch (error) {
    console.error("Create PYQ Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create PYQ.",
    });
  }
};


// Update PYQ
export const updatePYQ = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const pyq = await pyqService.updatePYQ(id, req.body);

    res.status(200).json({
      success: true,
      data: pyq,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update PYQ",
    });
  }
};

// Delete PYQ
export const deletePYQ = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await pyqService.deletePYQ(id);

    res.status(200).json({
      success: true,
      message: "PYQ deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete PYQ",
    });
  }
};


export const bulkCreatePYQs = async (
  req: Request,
  res: Response
) => {
  try {
    const { pyqs } = req.body;

    if (!Array.isArray(pyqs) || pyqs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide a non-empty pyqs array.",
      });
    }

    if (pyqs.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Import up to 500 PYQs per request.",
      });
    }

    const validPYQs = pyqs.every((pyq) =>
      pyq &&
      typeof pyq.title === "string" && pyq.title.trim() &&
      typeof pyq.subject === "string" && pyq.subject.trim() &&
      Number.isInteger(Number(pyq.semester)) &&
      Number(pyq.semester) > 0 &&
      typeof pyq.branch === "string" && pyq.branch.trim() &&
      Number.isInteger(Number(pyq.year)) &&
      Number(pyq.year) >= 1900 &&
      Number(pyq.year) <= 2100 &&
      typeof pyq.fileUrl === "string" &&
      /^https?:\/\//i.test(pyq.fileUrl)
    );

    if (!validPYQs) {
      return res.status(400).json({
        success: false,
        message: "Every PYQ must have a title, subject, semester, branch, year, and valid HTTP(S) PDF URL.",
      });
    }

    const result = await pyqService.bulkCreatePYQs(
      pyqs.map((pyq) => ({
        title: pyq.title.trim(),
        subject: pyq.subject.trim(),
        semester: Number(pyq.semester),
        branch: pyq.branch.trim(),
        year: Number(pyq.year),
        fileUrl: pyq.fileUrl.trim(),
      }))
    );

    return res.status(201).json({
      success: true,
      message: `${result.count} PYQs imported successfully.`,
      count: result.count,
    });
  } catch (error) {
    console.error("Bulk Create PYQs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to bulk import PYQs.",
    });
  }
};


export const bulkUploadPYQs = async (
  req: Request,
  res: Response
) => {
  const uploadedUrls: string[] = [];

  try {
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const csvFile = files?.csv?.[0];
    const pdfFiles = files?.pdfs ?? [];

    if (!csvFile || pdfFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Upload one CSV file and at least one PDF.",
      });
    }

    const records = parse(csvFile.buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    }) as Array<Record<string, string>>;

    if (records.length === 0 || records.length > 20) {
      return res.status(400).json({
        success: false,
        message: "The CSV must contain between 1 and 20 PYQ records.",
      });
    }

    const requiredColumns = [
      "title",
      "subject",
      "semester",
      "branch",
      "year",
      "filename",
    ];

    if (
      !requiredColumns.every((column) =>
        Object.prototype.hasOwnProperty.call(records[0], column)
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "CSV headers must be: title,subject,semester,branch,year,filename",
      });
    }

    if (records.length !== pdfFiles.length) {
      return res.status(400).json({
        success: false,
        message: "The number of CSV records must match the number of PDFs.",
      });
    }

    const filesByName = new Map<string, Express.Multer.File>();

    for (const file of pdfFiles) {
      const name = file.originalname.toLowerCase();

      if (filesByName.has(name)) {
        return res.status(400).json({
          success: false,
          message: `Duplicate PDF filename: ${file.originalname}`,
        });
      }

      filesByName.set(name, file);
    }

    const usedNames = new Set<string>();
    const validatedRecords: Array<{
      title: string;
      subject: string;
      semester: number;
      branch: string;
      year: number;
      filename: string;
      file: Express.Multer.File;
    }> = [];

    for (const record of records) {
      const title = record.title?.trim();
      const subject = record.subject?.trim();
      const branch = record.branch?.trim();
      const filename = record.filename?.trim();
      const semester = Number(record.semester);
      const year = Number(record.year);

      if (
        !title ||
        !subject ||
        !branch ||
        !filename ||
        !Number.isInteger(semester) ||
        semester < 1 ||
        semester > 8 ||
        !Number.isInteger(year) ||
        year < 1900 ||
        year > 2100
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid metadata for CSV record: ${filename || "unknown file"}`,
        });
      }

      const file = filesByName.get(filename.toLowerCase());

      if (!file || usedNames.has(filename.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: `Missing PDF or repeated filename in CSV: ${filename}`,
        });
      }

      usedNames.add(filename.toLowerCase());

      validatedRecords.push({
        title,
        subject,
        semester,
        branch,
        year,
        filename,
        file,
      });
    }

    if (usedNames.size !== pdfFiles.length) {
      return res.status(400).json({
        success: false,
        message: "Every selected PDF must appear exactly once in the CSV.",
      });
    }

    const pyqData = [];

    for (const record of validatedRecords) {
      const fileUrl = await uploadPdfToSupabase(
        record.file,
        "pyqs"
      );

      uploadedUrls.push(fileUrl);

      pyqData.push({
        title: record.title,
        subject: record.subject,
        semester: record.semester,
        branch: record.branch,
        year: record.year,
        fileUrl,
      });
    }

    const result = await pyqService.bulkCreatePYQs(pyqData);

    return res.status(201).json({
      success: true,
      message: `${result.count} PYQs uploaded successfully.`,
      count: result.count,
    });
  } catch (error) {
    console.error("Bulk PYQ Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: "Bulk PYQ upload failed. Check the backend logs.",
    });
  }
};

