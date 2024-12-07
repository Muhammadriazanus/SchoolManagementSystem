import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const teacherDetails = async (req, res) => {
    try {
        const {
            username,
            name,
            surname,
            email,
            phone,
            address,
            img,
            bloodtype,
            sex,
            createdAt,
            birthday,
            subjects, // Array of subject objects
            lessons,  // Array of lesson objects
            classes,  // Array of class objects
        } = req.body;

        console.log(req.body);

        // Validate required fields
        const requiredFields = [
            "username",
            "name",
            "surname",
            "email",
            "phone",
            "address",
            "bloodtype",
            "sex",
            "createdAt",
            "birthday",
            "img",
            "subjects",
            "lessons",
            "classes",
        ];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    message: `Missing required field: ${field}`,
                });
            }
        }

        // Parse dates
        const parsedCreatedAt = new Date(createdAt);
        const parsedBirthday = new Date(birthday);

        if (isNaN(parsedCreatedAt.getTime()) || isNaN(parsedBirthday.getTime())) {
            return res.status(400).json({
                message: "Invalid date format for 'createdAt' or 'birthday'",
            });
        }

        // Validate subjectIds exist in the Subject table
        const subjectIds = subjects.map((subject) => subject.id);
        console.log("subjectIds =======================>", subjectIds);

        const existingSubjects = await prisma.subject.findMany({
            where: {
                id: { in: subjectIds },
            },
        });

        console.log("Existing Subjects ===========================>", existingSubjects);

        if (existingSubjects.length !== subjectIds.length) {
            return res.status(400).json({
                message: "One or more subjectIds are invalid",
            });
        }

        // Validate lessonIds exist in the Lesson table
        const lessonIds = lessons.map((lesson) => lesson.id);
        const existingLessons = await prisma.lesson.findMany({
            where: {
                id: { in: lessonIds },
            },
        });
        console.log("lessonIds=========================>", lessonIds);
        console.log("existingLessons=========================>", existingLessons);

        if (existingLessons.length !== lessonIds.length) {
            return res.status(400).json({
                message: "One or more lessonIds are invalid",
            });
        }

        // Validate classIds exist in the Class table
        const classIds = classes.map((classItem) => classItem.id);
        const existingClasses = await prisma.class.findMany({
            where: {
                id: { in: classIds },
            },
        });

        if (existingClasses.length !== classIds.length) {
            return res.status(400).json({
                message: "One or more classIds are invalid",
            });
        }

        // Create teacher and include related subjects, lessons, and classes
        const newTeacher = await prisma.teacher.create({
            data: {
                username,
                name,
                surname,
                email,
                phone,
                address,
                bloodtype,
                sex,
                img,
                createdAt: parsedCreatedAt,
                birthday: parsedBirthday,
                subjects: {
                    connect: subjects.map((sub) => ({ id: sub.id })), // Ensure 'id' matches Prisma schema
                },
                lessons: {
                    connect: lessons.map((lesson) => ({ id: lesson.id })), // Connect lessons by 'id'
                },
                classes: {
                    connect: classes.map((classItem) => ({ id: classItem.id })), // Connect classes by 'id'
                },
            },
            include: {
                subjects: true, // Include subjects after creation
                lessons: true,  // Include lessons after creation
                classes: true,  // Include classes after creation
            },
        });

        return res.status(201).json({
            message: "Teacher created successfully",
            data: newTeacher, // Return teacher with associated subjects, lessons, and classes
        });
    } catch (error) {
        console.error("Error creating teacher:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
