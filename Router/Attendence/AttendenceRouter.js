import express from "express"

import { AttendenceController } from "../../Controller/Attendence/AttendenceController.js";
const AttendenceControllerAuth = express.Router()
console.log(AttendenceControllerAuth);


AttendenceControllerAuth.post("/Attendence", AttendenceController)
export default AttendenceControllerAuth