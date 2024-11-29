import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const gradeController = async (req, res) => {
    try {
        const { id, level, students, classess } = req.body;

        console.log("Incoming Request Body:", req.body);

        // Validate required fields
        if (
            !id ||
            !level ||
            !Array.isArray(students) ||
            !Array.isArray(classess)
        ) {
            return res.status(400).json({
                message: "Missing required fields or invalid data format",
            });
        }

        // Create new grade with related students and classes
        const newGradeStudent = await prisma.grade.create({
            data: {
                id,
                level,
                students,
                classess,
            },
        });

        return res
            .status(201)
            .json({ message: "Grade has been defined successfully", data: newGradeStudent });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
