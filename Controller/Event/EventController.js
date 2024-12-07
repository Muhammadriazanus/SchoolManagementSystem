import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const eventController = async (req, res) => {
    try {
        const {
            title,
            description,
            startTime,
            endTime,
            classId
        } = req.body;

        // Check for missing required fields
        if (!title || !description || !startTime || !endTime || !classId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Parse startTime and endTime as Date objects
        const parsedStartTime = new Date(startTime);
        const parsedEndTime = new Date(endTime);

        // Check if the startTime and endTime are valid Date objects
        if (isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
            return res.status(400).json({
                message: "Invalid startTime or endTime format. Must be a valid ISO-8601 DateTime.",
            });
        }

        // Check if the class exists
        const classExists = await prisma.class.findUnique({
            where: { id: classId }
        });

        if (!classExists) {
            return res.status(404).json({ message: `Class with ID ${classId} not found` });
        }

        // Create the new event and associate it with the class
        const newEvent = await prisma.event.create({
            data: {
                title,
                description,
                startTime: parsedStartTime, // Use parsed Date object
                endTime: parsedEndTime,     // Use parsed Date object
                classes: {
                    connect: { id: classId }
                }
            }
        });

        // Return success response
        return res.status(200).json({
            message: "Event has been created successfully",
            data: newEvent
        });
    } catch (error) {
        console.error("Error creating event:", error);  // Log the full error
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
