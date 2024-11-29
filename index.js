import express from "express";
import  StudentDetailsAuth  from "./Router/StudentDetails.js"; // Ensure this path and export are correct
import teacherDetailsAuth from "./Router/TeacherRouter.js";
import { parentDetailsPostReq } from "./Controller/parent/ParentPostController.js";
import gradeControllerAuth from "./Router/GradeRoute/GradeRouter.js";
const app = express();
const PORT = 56800; // Changed port to 3000 (adjust if needed)

app.use(express.json()); // Middleware to parse JSON requests

// Use the Router for the `/api/studentDetails` route
app.use("/api/studentDetails", StudentDetailsAuth);
app.use("/api/v1/studentDetails", StudentDetailsAuth);
app.use("/api/v1/teacherDetails", teacherDetailsAuth);
app.use("/api/v1/parentDetailsPostReq", parentDetailsPostReq);
app.use("/api/v1/gradeControllerAuth", gradeControllerAuth);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
