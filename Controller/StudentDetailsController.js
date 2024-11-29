import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const StudentDetails = async (req, res) => {
  try {
    const {
      id,          
      username ,   
      name,       
      surname,     
      email ,            
      phone ,            
      address,     
      img   ,      
      bloodType ,  
      sex ,        
      createdAt,        
      parentId,    
      classId ,    
      gradeId,     
      birthday,    
    } = req.body;

    // Ensure all required fields are included in the request
    if (
      !id ||   
      !username ||
      !name ||
      !surname ||
      !email ||
      !phone ||
      !address ||
      !sex ||
      !classId ||  
      !parentId ||
      !bloodType ||
      !gradeId ||
      !birthday ||
      !img ||
      !createdAt
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const paresedCreaditAt = new Date(createdAt)
    const paresedBrithDay = new Date(birthday)
    
    if(isNaN(paresedCreaditAt) || isNaN(paresedBrithDay)){
      return res.status(400).json({
        message: "Invalid date format for 'createdAt' or 'birthday'",
    });
    }
    // Check if the gradeId exists in the Grade table
    

    // Create the student in the database
    const newStudent = await prisma.student.create({
      data: {
        id,
        username,
        name,
        surname,
        email,
        phone,
        address,
        img,
        bloodType,
        sex,
        parentId,
        classId,
        gradeId,
       createdAt : paresedBrithDay,
       birthday : paresedBrithDay
      },
    });

    res.status(201).json({ message: "Student created successfully", data: newStudent });
  } catch (error) {
    console.error("Error in StudentDetails:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
