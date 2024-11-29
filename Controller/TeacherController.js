
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const teacherDetails = async (req, res) => {
    try {
        const {
            id,
            username,
            name,
            surname,
            email,
            phone,
            address,
            bloodType,
            sex,
            createdAt,
            birthday,
        } = req.body;

        console.log(req.body);
        
        // Validate required fields
        if (
            !id ||
            !username ||
            !name ||
            !surname ||
            !email ||
            !phone ||
            !address ||
            !bloodType ||
            !sex ||
            !createdAt ||
            !birthday
        ) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }

        // Parse dates to ensure valid format
        const parsedCreatedAt = new Date(createdAt);
        const parsedBirthday = new Date(birthday);

        if (isNaN(parsedCreatedAt) || isNaN(parsedBirthday)) {
            return res.status(400).json({
                message: "Invalid date format for 'createdAt' or 'birthday'",
            });
        }

        // Create the teacher
        const newTeacher = await prisma.teacher.create({
            data: {
                id,
                username,
                name,
                surname,
                email,
                phone,
                address,
                bloodType,
                sex,
                createdAt: parsedCreatedAt,
                birthday: parsedBirthday,
            },
        });

        return res
            .status(201)
            .json({ message: "Teacher created successfully", data: newTeacher });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
};
