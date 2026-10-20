
import { Request, Response } from "express";
import * as mockTestService from "../services/mockTests.service.js";


const getUserId = (req: Request): number | null => {
  const userId = req.user?.userId;

  if (
    typeof userId !== "number" ||
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    return null;
  }

  return userId;
};

const isValidId = (id: number) =>
  Number.isInteger(id) && id > 0;

const handleServiceError = (
  res: Response,
  error: unknown,
  fallbackMessage: string
) => {
  const code = error instanceof Error ? error.message : "";

  if (code === "MOCK_TEST_NOT_FOUND" || code === "RESULT_NOT_FOUND") {
    return res.status(404).json({
      success: false,
      message: "Mock test or result not found.",
    });
  }

  if (code === "ATTEMPT_NOT_FOUND") {
    return res.status(404).json({
      success: false,
      message: "Test attempt not found.",
    });
  }

  if (code === "ATTEMPT_ALREADY_SUBMITTED") {
    return res.status(409).json({
      success: false,
      message: "This test attempt has already been submitted.",
    });
  }

  if (code === "ATTEMPT_TIME_EXPIRED") {
    return res.status(409).json({
      success: false,
      message: "The test duration has expired. Answers were not submitted.",
    });
  }

  if (
    code === "DUPLICATE_ANSWER" ||
    code === "INVALID_QUESTION"
  ) {
    return res.status(400).json({
      success: false,
      message: "The submitted answers contain duplicate or invalid questions.",
    });
  }

  console.error(fallbackMessage, error);

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};

// GET /api/mock-tests
export const getPublishedTests = async (
  _req: Request,
  res: Response
) => {
  try {
    const tests = await mockTestService.getPublishedMockTests();

    return res.status(200).json({
      success: true,
      data: tests,
    });
  } catch (error) {
    return handleServiceError(res, error, "Failed to fetch mock tests.");
  }
};

// GET /api/mock-tests/:id
export const getPublishedTestById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mock test ID.",
      });
    }

    const test = await mockTestService.getPublishedMockTestById(id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Published mock test not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: test,
    });
  } catch (error) {
    return handleServiceError(res, error, "Failed to fetch mock test.");
  }
};

// GET /api/mock-tests/admin/all
export const getAllTestsForAdmin = async (
  _req: Request,
  res: Response
) => {
  try {
    const tests = await mockTestService.getAllMockTests();

    return res.status(200).json({
      success: true,
      data: tests,
    });
  } catch (error) {
    return handleServiceError(res, error, "Failed to fetch admin mock tests.");
  }
};

// POST /api/mock-tests
export const createTest = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      description,
      subject,
      semester,
      branch,
      duration,
      questions,
    } = req.body;

    if (
      typeof title !== "string" || !title.trim() ||
      typeof subject !== "string" || !subject.trim() ||
      !Number.isInteger(Number(semester)) ||
      Number(semester) < 1 || Number(semester) > 8 ||
      !Number.isInteger(Number(duration)) ||
      Number(duration) < 1 || Number(duration) > 300 ||
      (branch !== undefined &&
        (typeof branch !== "string" || !branch.trim())) ||
      (description !== undefined &&
        typeof description !== "string") ||
      !Array.isArray(questions) ||
      questions.length < 1 ||
      questions.length > 200
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide valid test details and between 1 and 200 questions.",
      });
    }

    const validOptions = ["A", "B", "C", "D"];

    const validQuestions = questions.every((question: any) =>
      question &&
      typeof question.questionText === "string" &&
      question.questionText.trim() &&
      typeof question.optionA === "string" && question.optionA.trim() &&
      typeof question.optionB === "string" && question.optionB.trim() &&
      typeof question.optionC === "string" && question.optionC.trim() &&
      typeof question.optionD === "string" && question.optionD.trim() &&
      validOptions.includes(question.correctOption) &&
      (question.explanation === undefined ||
        typeof question.explanation === "string") &&
      (question.marks === undefined ||
        (Number.isInteger(Number(question.marks)) &&
          Number(question.marks) > 0 &&
          Number(question.marks) <= 100))
    );

    if (!validQuestions) {
      return res.status(400).json({
        success: false,
        message: "Each question needs text, four options, a valid correct option, and valid marks.",
      });
    }

    const test = await mockTestService.createMockTest({
      title: title.trim(),
      description: description?.trim() || undefined,
      subject: subject.trim(),
      semester: Number(semester),
      branch: branch?.trim() || "CSE-CY",
      duration: Number(duration),
      questions: questions.map((question: any) => ({
        questionText: question.questionText.trim(),
        optionA: question.optionA.trim(),
        optionB: question.optionB.trim(),
        optionC: question.optionC.trim(),
        optionD: question.optionD.trim(),
        correctOption: question.correctOption,
        explanation: question.explanation?.trim() || undefined,
        marks: question.marks === undefined ? 1 : Number(question.marks),
      })),
    });

    return res.status(201).json({
      success: true,
      message: "Mock test created as a draft.",
      data: test,
    });
  } catch (error) {
    return handleServiceError(res, error, "Failed to create mock test.");
  }
};

// PATCH /api/mock-tests/:id/publish
export const publishTest = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { isPublished } = req.body;

    if (!isValidId(id) || typeof isPublished !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Provide a valid test ID and boolean isPublished value.",
      });
    }

    if (isPublished) {
      const test = await mockTestService.getAllMockTests();
      const target = test.find((item) => item.id === id);

      if (!target) {
        return res.status(404).json({
          success: false,
          message: "Mock test not found.",
        });
      }

      if (target._count.questions < 1) {
        return res.status(400).json({
          success: false,
          message: "Add at least one question before publishing.",
        });
      }
    }

    const updated = await mockTestService.setMockTestPublished(
      id,
      isPublished
    );

    return res.status(200).json({
      success: true,
      message: isPublished ? "Mock test published." : "Mock test unpublished.",
      data: updated,
    });
  } catch (error) {
    return handleServiceError(res, error, "Failed to update publication status.");
  }
};

// DELETE /api/mock-tests/:id
export const deleteTest = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mock test ID.",
      });
    }

    await mockTestService.deleteMockTest(id);

    return res.status(200).json({
      success: true,
      message: "Mock test deleted.",
    });
  } catch (error) {
    return handleServiceError(res, error, "Failed to delete mock test.");
  }
};

// POST /api/mock-tests/:id/attempts
export const startAttempt = async (
  req: Request,
  res: Response
) => {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Valid authentication is required.",
    });
  }

  try {
    const mockTestId = Number(req.params.id);

    if (!isValidId(mockTestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mock test ID.",
      });
    }

    const attempt = await mockTestService.startMockTestAttempt(
      userId,
      mockTestId
    );

    return res.status(201).json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    return handleServiceError(res, error, "Failed to start mock test.");
  }
};

// POST /api/mock-tests/attempts/:attemptId/submit
export const submitAttempt = async (
  req: Request,
  res: Response
) => {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Valid authentication is required.",
    });
  }

  try {
    const attemptId = Number(req.params.attemptId);
    const { answers } = req.body;

    if (
      !isValidId(attemptId) ||
      !Array.isArray(answers) ||
      answers.length > 200
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid attempt ID and an answers array.",
      });
    }

    const validOptions = ["A", "B", "C", "D"];

    if (
      !answers.every((answer: any) =>
        answer &&
        Number.isInteger(answer.questionId) &&
        answer.questionId > 0 &&
        validOptions.includes(answer.selectedOption)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Every answer must include a valid questionId and selectedOption.",
      });
    }

    const result = await mockTestService.submitMockTestAttempt(
      userId,
      attemptId,
      answers
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleServiceError(res, error, "Failed to submit mock test.");
  }
};

// GET /api/mock-tests/attempts/:attemptId/result
export const getAttemptResult = async (
  req: Request,
  res: Response
) => {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Valid authentication is required.",
    });
  }

  try {
    const attemptId = Number(req.params.attemptId);

    if (!isValidId(attemptId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attempt ID.",
      });
    }

    const result = await mockTestService.getMockTestResult(
      userId,
      attemptId
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleServiceError(res, error, "Failed to fetch test result.");
  }
};
