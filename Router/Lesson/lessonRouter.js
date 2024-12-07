import express from "express"

import { lessonController } from "../../Controller/lesson/LessonController.js"
const lessonControllerAuth = express.Router()

lessonControllerAuth.post("/lessonControllerAuth",lessonController)

export default  lessonControllerAuth
