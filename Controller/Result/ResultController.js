import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resultController = async (req, res) => {
    try {
        const { score, lessonId, gradeId, examId, assignmentId, studentId } = req.body;

        console.log("Request Body:", req.body);

        // Validate mandatory fields
        if (!score || !lessonId || !gradeId || !studentId) {
            return res.status(400).json({
                message: "Missing required fields: score, lessonId, gradeId, or studentId",
            });
        }

        // Relational checks
        if (examId) {
            const examExist = await prisma.exam.findUnique({ where: { id: examId } });
            if (!examExist) {
                return res.status(404).json({ message: `Exam not found with ID: ${examId}` });
            }
        }

        const lessonExist = await prisma.lesson.findUnique({ where: { id: lessonId } });
        if (!lessonExist) {
            return res.status(404).json({ message: `Lesson not found with ID: ${lessonId}` });
        }

        const gradeExist = await prisma.grade.findUnique({ where: { id: gradeId } });
        if (!gradeExist) {
            return res.status(404).json({ message: `Grade not found with ID: ${gradeId}` });
        }

        if (assignmentId) {
            const assignmentExist = await prisma.assignment.findUnique({ where: { id: assignmentId } });
            if (!assignmentExist) {
                return res.status(404).json({ message: `Assignment not found with ID: ${assignmentId}` });
            }
        }

        const studentExist = await prisma.student.findUnique({ where: { id: studentId } });
        if (!studentExist) {
            return res.status(404).json({ message: `Student not found with ID: ${studentId}` });
        }

        // Create the result
        const newResult = await prisma.result.create({
            data: {
                score,
                lessonId,
                gradeId,
                studentId,
                examId: examId ? examId : undefined,
                assignmentId: assignmentId ? assignmentId : undefined,
            },
        });

        console.log("New Result:", newResult);

        return res.status(201).json({
            message: "Result created successfully",
            data: newResult,
        });

    } catch (error) {
        console.error("Error in resultController:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
