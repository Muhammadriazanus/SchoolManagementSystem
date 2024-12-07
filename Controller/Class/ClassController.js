import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); 

export const classController = async (req, res) => {
    try {
        const {
            name,           // Class name
            capacity,       // Class capacity
            supervisorId,   // Teacher supervisor ID
            gradeId,        // Grade ID
            lessonIds,      // Array of lesson IDs
            studentIds,     // Array of student IDs
            events = [],    // Array of events to create
            announcements = [], // Array of announcements to create
        } = req.body;

        console.log("Request Body:", req.body);

        // Ensure all required fields are included in the request
        const missingFields = getMissingFields(req.body);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Missing required fields",
                missingFields,
            });
        }

        // Ensure lessonIds and studentIds are arrays
        const lessonIdsArray = Array.isArray(lessonIds) ? lessonIds : [];
        const studentIdsArray = Array.isArray(studentIds) ? studentIds : [];

        // Check if supervisor exists
        const supervisorExists = await prisma.teacher.findUnique({
            where: { id: supervisorId },
        });

        if (!supervisorExists) {
            return res.status(400).json({
                message: `Teacher with ID ${supervisorId} does not exist`,
            });
        }

        // Check if grade exists
        const gradeExists = await prisma.grade.findUnique({
            where: { id: gradeId },
        });

        if (!gradeExists) {
            return res.status(400).json({
                message: `Grade with ID ${gradeId} does not exist`,
            });
        }

        // Validate events array
        for (const event of events) {
            if (!event.title || !event.date) {
                return res.status(400).json({
                    message: "Each event must have a title and a date.",
                });
            }
        }

        // Create the class along with related entities
        const newClass = await prisma.class.create({
            data: {
                name,
                capacity,
                supervisor: { connect: { id: supervisorId } },
                grade: { connect: { id: gradeId } },
                lessons: {
                    connect: lessonIdsArray.map((id) => ({ id })), // Safely connect lessons
                },
                students: {
                    connect: studentIdsArray.map((id) => ({ id })), // Safely connect students
                },
                events: {
                    create: events.map((event) => ({
                        title: event.title,
                        description: event.description,
                        startTime: new Date(event.startTime),
                        endTime: new Date(event.endTime),
                    })),
                },
                announcements: {
                    create: announcements.map((announcement) => ({
                        title: announcement.title,
                        description: announcement.description,
                        startTime: new Date(announcement.startTime),
                        endTime: new Date(announcement.endTime),
                    })),
                },
            },
        });

        // Return success response
        res.status(201).json({ message: "Class created successfully", data: newClass });
    } catch (error) {
        console.error("Error in CreateClass:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Helper function to check for missing fields
const getMissingFields = (body) => {
    const requiredFields = [
        "name", "capacity", "supervisorId", "gradeId", "lessonIds",
        "studentIds", "events", "announcements"
    ];
    return requiredFields.filter(field => !body[field]);
};
