import express from "express";
import {getMeetingRooms, getMeetingRoom} from "../controllers/meetingroomController.js";        

const router = express.Router();

router.get("/", getMeetingRooms);
router.get("/:id", getMeetingRoom);

export default router;