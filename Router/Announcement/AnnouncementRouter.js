import express from "express"
import { Announcement } from "../../Controller/Announcement/Announcement.js"

const AnnouncementAuth = express.Router()

AnnouncementAuth.post("/AnnouncementAuth",Announcement)
export default AnnouncementAuth;
