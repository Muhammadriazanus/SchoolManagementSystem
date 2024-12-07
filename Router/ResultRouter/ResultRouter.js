import express from "express"
import { resultController } from "../../Controller/Result/ResultController.js"

const resultControllerAuth = express.Router()
resultControllerAuth.post("/resultControllerAuth", resultController)
export default resultControllerAuth