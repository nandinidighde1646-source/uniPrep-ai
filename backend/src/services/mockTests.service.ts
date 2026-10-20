
import prisma from "../prisma/prisma.js";

interface QuestionInput {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D";
  explanation?: string;
  marks?: number;
}

interface CreateMockTestInput {
  title: string;
  description?: string;
  subject: string;
  semester: number;
  branch?: string;
  duration: number;
  questions: QuestionInput[];
}

const publicQuestionSelect = {
  id: true,
  questionText: true,
  optionA: true,
  optionB: true,
  optionC: true,
  optionD: true,
  marks: true,
};

// Admin: create a test with its questions in one transaction.
export const createMockTest = async (data: CreateMockTestInput) => {
  const totalMarks = data.questions.reduce(
    (sum, question) => sum + (question.marks ?? 1),
    0
  );

  return prisma.mockTest.create({
    data: {
      title: data.title,
      description: data.description,
      subject: data.subject,
      semester: data.semester,
      branch: data.branch ?? "CSE-CY",
      duration: data.duration,
      totalMarks,
      questions: {
        create: data.questions.map((question) => ({
          ...question,
          marks: question.marks ?? 1,
        })),
      },
    },
    include: {
      questions: true,
    },
  });
};

// Students: list published tests without answer keys.
export const getPublishedMockTests = async () => {
  return prisma.mockTest.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { questions: true } },
    },
  });
};

// Students: view a published test without correct answers or explanations.
export const getPublishedMockTestById = async (id: number) => {
  return prisma.mockTest.findFirst({
    where: { id, isPublished: true },
    select: {
      id: true,
      title: true,
      description: true,
      subject: true,
      semester: true,
      branch: true,
      duration: true,
      totalMarks: true,
      questions: {
        select: publicQuestionSelect,
        orderBy: { id: "asc" },
      },
    },
  });
};

// Admin: list all tests, including drafts.
export const getAllMockTests = async () => {
  return prisma.mockTest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { questions: true } },
    },
  });
};

// Admin: publish or unpublish a test.
export const setMockTestPublished = async (
  id: number,
  isPublished: boolean
) => {
  return prisma.mockTest.update({
    where: { id },
    data: { isPublished },
  });
};

// Admin: delete a test and its dependent questions/attempts.
export const deleteMockTest = async (id: number) => {
  return prisma.mockTest.delete({
    where: { id },
  });
};

// Student: begin an attempt on a published test.
export const startMockTestAttempt = async (
  userId: number,
  mockTestId: number
) => {
  const test = await prisma.mockTest.findFirst({
    where: { id: mockTestId, isPublished: true },
    select: { id: true, totalMarks: true },
  });

  if (!test) {
    throw new Error("MOCK_TEST_NOT_FOUND");
  }

  return prisma.mockTestAttempt.create({
    data: {
      userId,
      mockTestId,
      totalMarks: test.totalMarks,
    },
    select: {
      id: true,
      mockTestId: true,
      totalMarks: true,
      startedAt: true,
    },
  });
};

// Student: submit answers; score is calculated using the stored answer key.
export const submitMockTestAttempt = async (
  userId: number,
  attemptId: number,
  answers: { questionId: number; selectedOption: "A" | "B" | "C" | "D" }[]
) => {
  return prisma.$transaction(async (tx) => {
    const attempt = await tx.mockTestAttempt.findFirst({
      where: { id: attemptId, userId },
      include: {
        mockTest: {
          include: { questions: true },
        },
      },
    });

    if (!attempt) {
      throw new Error("ATTEMPT_NOT_FOUND");
    }

    if (attempt.submittedAt) {
      throw new Error("ATTEMPT_ALREADY_SUBMITTED");
    }

    const now = new Date();
    const deadline =
      attempt.startedAt.getTime() + attempt.mockTest.duration * 60_000;

    if (now.getTime() > deadline) {
      throw new Error("ATTEMPT_TIME_EXPIRED");
    }

    const questionMap = new Map(
      attempt.mockTest.questions.map((question) => [
        question.id,
        question,
      ])
    );

    let score = 0;
    const submittedQuestionIds = new Set<number>();

    for (const answer of answers) {
      if (submittedQuestionIds.has(answer.questionId)) {
        throw new Error("DUPLICATE_ANSWER");
      }

      submittedQuestionIds.add(answer.questionId);

      const question = questionMap.get(answer.questionId);

      if (!question) {
        throw new Error("INVALID_QUESTION");
      }

      const isCorrect = question.correctOption === answer.selectedOption;

      if (isCorrect) {
        score += question.marks;
      }

      await tx.attemptAnswer.create({
        data: {
          attemptId,
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          isCorrect,
        },
      });
    }

    const submittedAttempt = await tx.mockTestAttempt.update({
      where: { id: attemptId },
      data: {
        score,
        submittedAt: now,
      },
      select: {
        id: true,
        score: true,
        totalMarks: true,
        startedAt: true,
        submittedAt: true,
      },
    });

    return {
      ...submittedAttempt,
      percentage:
        submittedAttempt.totalMarks > 0
          ? Math.round(
              (submittedAttempt.score / submittedAttempt.totalMarks) * 100
            )
          : 0,
    };
  });
};

// Student: view a submitted result, including explanations and answer review.
export const getMockTestResult = async (
  userId: number,
  attemptId: number
) => {
  const attempt = await prisma.mockTestAttempt.findFirst({
    where: {
      id: attemptId,
      userId,
      submittedAt: { not: null },
    },
    include: {
      mockTest: {
        select: {
          title: true,
          subject: true,
          questions: {
            select: {
              id: true,
              questionText: true,
              optionA: true,
              optionB: true,
              optionC: true,
              optionD: true,
              correctOption: true,
              explanation: true,
              marks: true,
            },
          },
        },
      },
      answers: true,
    },
  });

  if (!attempt) {
    throw new Error("RESULT_NOT_FOUND");
  }

  return {
    id: attempt.id,
    score: attempt.score,
    totalMarks: attempt.totalMarks,
    submittedAt: attempt.submittedAt,
    percentage:
      attempt.totalMarks > 0
        ? Math.round((attempt.score / attempt.totalMarks) * 100)
        : 0,
    test: attempt.mockTest,
    answers: attempt.answers,
  };
};
