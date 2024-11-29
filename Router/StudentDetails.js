import express from  "express"

import { StudentDetails } from "../Controller/StudentDetailsController.js"

const StudentDetailsAuth = express.Router()

StudentDetailsAuth.post("/StudentDetailsAuth" , StudentDetails)
StudentDetailsAuth.get("/StudentDetailsAuth" , StudentDetails)
export default StudentDetailsAuth