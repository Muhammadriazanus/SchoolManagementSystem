import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const lessonController = async (req, res) => {
    try {
        const {
            name,
            day,
            startTime,
            endTime,
            subjectId,
            classId,
            teacherId,
            exams,         // Array of existing Exam IDs
            assignments,   // Array of existing Assignment IDs
            attendances    // Array of existing Attendance IDs
        } = req.body;

        // Validate required fields
        if (!name || !day || !startTime || !endTime || !subjectId || !classId || !teacherId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Ensure related entities exist in the database
        const [subject, classEntity, teacher, examEntities, assignmentEntities, attendanceEntities] = await Promise.all([
            prisma.subject.findUnique({ where: { id: subjectId } }),
            prisma.class.findUnique({ where: { id: classId } }),
            prisma.teacher.findUnique({ where: { id: teacherId } }),
            prisma.exam.findMany({ where: { id: { in: exams } } }), // Fetching existing exams
            prisma.assignment.findMany({ where: { id: { in: assignments } } }), // Fetching existing assignments
            prisma.attendance.findMany({ where: { id: { in: attendances } } })  // Fetching existing attendance records
        ]);

        if (!subject) {
            return res.status(404).json({ message: `Subject with ID ${subjectId} not found` });
        }
        if (!classEntity) {
            return res.status(404).json({ message: `Class with ID ${classId} not found` });
        }
        if (!teacher) {
            return res.status(404).json({ message: `Teacher with ID ${teacherId} not found` });
        }

        // Ensure all exams are valid and exist in the database
        const invalidExamIds = exams.filter(examId => !examEntities.some(exam => exam.id === examId));
        if (invalidExamIds.length > 0) {
            return res.status(404).json({
                message: `Exam(s) with ID(s) ${invalidExamIds.join(", ")} not found`,
            });
        }

        // Ensure all assignments are valid and exist in the database
        const invalidAssignmentIds = assignments.filter(assignmentId => !assignmentEntities.some(assignment => assignment.id === assignmentId));
        if (invalidAssignmentIds.length > 0) {
            return res.status(404).json({
                message: `Assignment(s) with ID(s) ${invalidAssignmentIds.join(", ")} not found`,
            });
        }

        // Ensure all attendances are valid and exist in the database
        const invalidAttendanceIds = attendances.filter(attendanceId => !attendanceEntities.some(attendance => attendance.id === attendanceId));
        if (invalidAttendanceIds.length > 0) {
            return res.status(404).json({
                message: `Attendance record(s) with ID(s) ${invalidAttendanceIds.join(", ")} not found`,
            });
        }

        // Create a new lesson with relationships
        const newLesson = await prisma.lesson.create({
            data: {
                name,
                day,
                starttime: new Date(startTime),
                endtime: new Date(endTime),
                subject: {
                    connect: { id: subjectId },
                },
                class: {
                    connect: { id: classId },
                },
                teacher: {
                    connect: { id: teacherId },
                },
                exams: exams?.length
                    ? { connect: exams.map((examId) => ({ id: examId })) }
                    : undefined,
                assignments: assignments?.length
                    ? { connect: assignments.map((assignmentId) => ({ id: assignmentId })) }
                    : undefined,
                attendances: attendances?.length
                    ? { connect: attendances.map((attendanceId) => ({ id: attendanceId })) }
                    : undefined,
            },
        });

        // Respond with the created lesson
        return res.status(201).json({
            message: "Lesson created successfully",
            data: newLesson,
        });
    } catch (error) {
        console.error("Error creating lesson:", error);
        return res.status(500).json({
            message: "Lesson could not be created",
            error: error.message,
        });
    }
};
