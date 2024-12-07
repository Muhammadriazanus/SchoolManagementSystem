import express from "express"

import { subjectController } from "../../Controller/Subject/subjectController.js"

const subjectControllerAuth = express.Router()

subjectControllerAuth.post("/subjectController",subjectController)
export default subjectControllerAuth