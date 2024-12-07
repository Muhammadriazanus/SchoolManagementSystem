import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const AssigmentController = async (req, res) => {
    try {
        const {
            title,
            startDate,
            dueDate,
            lessonId,
            results, // Expecting an array of result objects
        } = req.body;

        console.log("Request body:", req.body);

        // Check for missing fields
        if (!title || !startDate || !dueDate || !lessonId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate if the lesson exists
        const lessonExist = await prisma.lesson.findUnique({
            where: { id: lessonId },
        });

        if (!lessonExist) {
            return res
                .status(404)
                .json({ message: `Lesson does not exist with ID: ${lessonId}` });
        }

        // Create the assignment
        const newAssignment = await prisma.assignment.create({
            data: {
                title,
                startDate: new Date(startDate), // Ensure proper DateTime format
                dueDate: new Date(dueDate),     // Ensure proper DateTime format
                lesson: { connect: { id: lessonId } },
            },
        });

        // Add results if provided
        if (results && results.length > 0) {
            const resultData = results.map((result) => ({
                score: result.score,
                gradeId: result.gradeId,
                lessonId: lessonId, // Ensure correct lessonId is used here
                examId: result.examId || null,
                assignmentId: newAssignment.id, // Connect this assignment
                studentId: result.studentId,
            }));

            // Insert the results in bulk
            await prisma.result.createMany({
                data: resultData,
            });
        }

        // Fetch the assignment with results for response
        const assignmentWithResults = await prisma.assignment.findUnique({
            where: { id: newAssignment.id },
            include: { results: true }, // Include the related results
        });

        // Send success response
        return res.status(201).json({
            message: "Assignment has been created successfully",
            data: assignmentWithResults,
        });
    } catch (error) {
        console.error("Error in AssignmentController:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
