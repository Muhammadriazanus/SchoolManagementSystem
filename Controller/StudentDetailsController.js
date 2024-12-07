import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const StudentDetails = async (req, res) => {
  try {
    const {
      username,
      name,
      surname,
      email,
      phone,
      address,
      img,
      bloodType,
      sex,
      createdAt,
      classId,   // Ensure classId is being passed correctly
      gradeId,
      birthday,
      results,
      attendances,
      parentId,  // Add parentId to request body
      parent,    // Add parent to request body
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

    const parsedCreatedAt = new Date(createdAt);
    const parsedBirthday = new Date(birthday);

    // Validate date fields
    if (isNaN(parsedCreatedAt) || isNaN(parsedBirthday)) {
      return res.status(400).json({
        message: "Invalid date format for 'createdAt' or 'birthday'",
      });
    }

    // Check if Parent exists before proceeding
    let existingParent = await prisma.parent.findUnique({
      where: { id: parentId },
    });

    if (!existingParent && parent) {
      // If the parent doesn't exist, create a new parent
      existingParent = await prisma.parent.create({
        data: {
          name: parent.name,
          phone: parent.phone,
          email: parent.email,
          address: parent.address,
          username: parent.username,
        },
      });
    }

    // Check if Class exists
    const existingClass = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!existingClass) {
      return res.status(400).json({
        message: `Class with ID ${classId} does not exist`,
      });
    }

    // Check if Grade exists
    const existingGrade = await prisma.grade.findUnique({
      where: { id: gradeId },
    });

    if (!existingGrade) {
      return res.status(400).json({
        message: `Grade with ID ${gradeId} does not exist`,
      });
    }

    // Check if username already exists
    const existingStudent = await prisma.student.findUnique({
      where: { username },
    });

    if (existingStudent) {
      return res.status(400).json({
        message: `Username '${username}' is already taken`,
      });
    }

    // Create the student in the database
    const newStudent = await prisma.student.create({
      data: {
        username,
        name,
        surname,
        email,
        phone,
        address,
        img,
        bloodType,
        sex,
        createdAt: parsedCreatedAt,
        birthday: parsedBirthday,
        parent: { connect: { id: parentId } }, // Connect parent by ID
        classes: { connect: { id: classId } }, // Connect class by ID
        grade: { connect: { id: gradeId } },   // Connect grade by ID
        results: {
          create: results.map(result => ({
            score: result.score,
            lesson: { connect: { id: result.lessonId } }, // Connect lessonId to the result
            grade: { connect: { id: result.gradeId } },   // Connect gradeId to the result
          })),
        },
        attendances: {
          create: attendances.map(attendance => ({
            date: new Date(attendance.date),
            present: attendance.present,
            lesson: { connect: { id: attendance.lessonId } }, // Connect lessonId to the attendance
          })),
        },
      },
    });

    res.status(201).json({ message: "Student created successfully", data: newStudent });
  } catch (error) {
    console.error("Error in StudentDetails:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Helper function to check for missing fields
const getMissingFields = (body) => {
  const requiredFields = [
    "username", "name", "surname", "email", "phone", "address", "sex",
    "parentId", "bloodType", "gradeId", "birthday", "img", "createdAt",
    "results", "attendances", "parent", "classId"
  ];
  return requiredFields.filter(field => !body[field]);
};
