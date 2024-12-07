import express from "express"


import { parentDetailsPostReq } from "../../Controller/parent/ParentPostController.js"

const parentDetailsPostReqAuth = express.Router()
// console.log(parentDetailsPostReqAuth);


parentDetailsPostReqAuth.post("/parentDetailsPostReqAuth",parentDetailsPostReq)

export default parentDetailsPostReq