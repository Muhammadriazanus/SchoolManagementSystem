import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const Announcement = async (req, res) => {
    try {
        const {
            title,
            description,
            date,
            classId, // classId is optional, but we will still check for it
        } = req.body;

        // Check if required fields are provided
        if (!title || !description || !date) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if the class exists if classId is provided
        let classExists = null;
        if (classId) {
            classExists = await prisma.class.findUnique({
                where: { id: classId },
            });

            if (!classExists) {
                return res.status(404).json({ message: `Class with ID ${classId} doesn't exist` });
            }
        }

        // Create the announcement
        const newAnnouncement = await prisma.announcement.create({
            data: {
                title,
                description,
                date,
                // Connect the class if classId is provided
                classes: classId ? { connect: { id: classId } } : undefined,
            },
        });

        // Send response
        return res.status(201).json({
            message: "New announcement has been created",
            data: newAnnouncement,
        });
    } catch (error) {
        console.error("Error creating announcement:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
