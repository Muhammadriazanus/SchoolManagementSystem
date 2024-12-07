import express from "express";
import StudentDetailsAuth from "./Router/StudentDetails.js"; // Ensure this path and export are correct
import teacherDetailsAuth from "./Router/TeacherRouter.js";
// import { parentDetailsPostReq } from "./Controller/parent/ParentPostController.js";
import parentDetailsPostReqAuth from "./Router/parentRouterPost/parentRouter.js"
import gradeControllerAuth from "./Router/GradeRoute/GradeRouter.js";
import lessonControllerAuth from "./Router/Lesson/lessonRouter.js";
import ExamControllerAuth from "./Router/Exam/ExamRouter.js";
import AssigmentAuth from "./Router/Assigment/AssigmentRouter.js";
import resultControllerAuth from "./Router/ResultRouter/ResultRouter.js";
import AttendenceControllerAuth from "./Router/Attendence/AttendenceRouter.js";
import eventControllerAuth from "./Router/Event/EventRouter.js";
import AnnouncementAuth from "./Router/Announcement/AnnouncementRouter.js";
import classControllerAuth from "./Router/ClassRouter/ClassRouter.js";
import subjectControllerAuth from "./Router/Subject/SubjectRouter.js";
const app = express();
const PORT = 56800; // Changed port to 3000 (adjust if needed)

app.use(express.json()); // Middleware to parse JSON requests

// Use the Router for the `/api/studentDetails` route
app.use("/api/studentDetails", StudentDetailsAuth);
app.use("/api/v1/studentDetails", StudentDetailsAuth);
app.use("/api/v1/teacherDetails", teacherDetailsAuth);
app.use("/api/v1/parentDetailsPostReq", parentDetailsPostReqAuth);
app.use("/api/v1/gradeControllerAuth", gradeControllerAuth);
app.use("/api/v1/lessonControllerAuth", lessonControllerAuth);
app.use("/api/v1/ExamControllerAuth", ExamControllerAuth);
app.use("/api/v1/AssigmentAuth", AssigmentAuth);
app.use("/api/v1/resultControllerAuth", resultControllerAuth);
app.use("/api/v1/AttendenceControllerAuth", AttendenceControllerAuth)
app.use("/api/v1/eventControllerAuth", eventControllerAuth)
app.use("/api/v1/AnnouncementAuth", AnnouncementAuth)
app.use("/api/v1/classAuth", classControllerAuth)
app.use("/api/v1/", subjectControllerAuth)



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
