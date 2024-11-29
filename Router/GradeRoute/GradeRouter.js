import express from 'express'

import { gradeController } from '../../Controller/Grade/gradeController.js'

const gradeControllerAuth = express.Router()

gradeControllerAuth.post("/gradeController",gradeController)

export default gradeControllerAuth