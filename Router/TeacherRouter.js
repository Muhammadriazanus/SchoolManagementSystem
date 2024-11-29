import express from "express"

import { teacherDetails } from "../Controller/TeacherController.js"

const teacherDetailsAuth = express.Router()

teacherDetailsAuth.post("/teacherDetails",teacherDetails)
// teacherDetailsAuth.get("/teacherDetails",teacherDetails)

export default  teacherDetailsAuth