import express from "express"

import { AssigmentController } from "../../Controller/Assigment/AssigmentController.js"

const AssigmentAuth = express.Router()

AssigmentAuth.post("/AssigmentAuth",AssigmentController)
export default AssigmentAuth
