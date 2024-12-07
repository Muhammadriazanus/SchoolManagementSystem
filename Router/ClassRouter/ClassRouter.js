import express from "express"

import { classController } from "../../Controller/Class/ClassController.js"

const classControllerAuth = express.Router()

classControllerAuth.post("/classControllerAuth",classController)

export default classControllerAuth