import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const subjectController = async (req, res) => {
    const { name, teachers, lessons } = req.body;

    const requiredFields = ["name", "teachers", "lessons"];

    // Validate required fields
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ message: `Missing required field: ${field}` });
        }
    }

    try {
        // Check if a subject with the same name already exists
        const existingSubject = await prisma.subject.findUnique({
            where: { name },
        });

        if (existingSubject) {
            return res.status(409).json({
                message: `Subject with the name '${name}' already exists.`,
            });
        }

        // Validate teachers array
        const teacherIds = teachers.map(teacher => teacher.id);
        const existingTeachers = await prisma.teacher.findMany({
            where: { id: { in: teacherIds } },
        });

        if (existingTeachers.length !== teacherIds.length) {
            const missingTeacherIds = teacherIds.filter(id => !existingTeachers.some(teacher => teacher.id === id));
            return res.status(404).json({
                message: `The following teacher IDs are not found: ${missingTeacherIds.join(", ")}`,
            });
        }

        // Validate lessons array
        const lessonIds = lessons.map(lesson => lesson.id);
        const existingLessons = await prisma.lesson.findMany({
            where: { id: { in: lessonIds } },
        });

        if (existingLessons.length !== lessonIds.length) {
            const missingLessonIds = lessonIds.filter(id => !existingLessons.some(lesson => lesson.id === id));
            return res.status(404).json({
                message: `The following lesson IDs are not found: ${missingLessonIds.join(", ")}`,
            });
        }

        // Create the subject and associate teachers and lessons
        const newSubject = await prisma.subject.create({
            data: {
                name,
                teachers: {
                    connect: teacherIds.map(id => ({ id })),
                },
                lessons: {
                    connect: lessonIds.map(id => ({ id })),
                },
            },
        });

        return res.status(201).json({
            message: "Subject created successfully",
            data: newSubject,
        });
    } catch (error) {
        console.error("Error creating subject:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
