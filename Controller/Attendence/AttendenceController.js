import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const AttendenceController = async (req, res) => {
    try {
        const { date, present, studentId, lessonId } = req.body;

        // Validate mandatory fields
        if (!date || !present || !studentId || !lessonId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if the student exists
        let studentExists = null;
        if (studentId) {
            studentExists = await prisma.student.findUnique({
                where: { id: studentId }
            });
        }
        
        if (!studentExists) {
            return res.status(404).json({ message: `Student with ID ${studentId} doesn't exist` });
        }

        // Check if the lesson exists
        let lessonExists = null;
        if (lessonId) {
            lessonExists = await prisma.lesson.findUnique({
                where: { id: lessonId }
            });
        }
        
        if (!lessonExists) {
            return res.status(404).json({ message: `Lesson with ID ${lessonId} doesn't exist` });
        }

        // Create the attendance record (without specifying id)
        const newAttendance = await prisma.attendance.create({
            data: {
                date,
                present,
                student: { connect: { id: studentId } },
                lesson: { connect: { id: lessonId } },
            }
        });

        return res.status(200).json({ message: "Attendance has been created", data: newAttendance });
    } catch (error) {
        return res.status(500).json({ message: "Attendance could not be created", error: error.message });
    }
};
