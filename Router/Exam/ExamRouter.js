import express, { Router } from "express"

import { ExamController } from "../../Controller/Exam/ExamController.js"

const  ExamControllerAuth = express.Router() 
ExamControllerAuth.post("/Exam",ExamController)
export default ExamControllerAuth