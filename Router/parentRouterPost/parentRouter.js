import express from "express"


import { parentDetailsPostReq } from "../../Controller/parent/ParentPostController"

const parentDetailsPostReqAuth = express.Router()

parentDetailsPostReqAuth.post("/parentDetailsPostReqAuth",parentDetailsPostReq)

export default parentDetailsPostReq