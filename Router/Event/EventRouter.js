import express from "express"

import { eventController } from "../../Controller/Event/EventController.js"

const eventControllerAuth = express.Router()

eventControllerAuth.post("/eventControllerAuth", eventController)
export default eventControllerAuth