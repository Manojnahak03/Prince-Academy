import express from "express";
import Notice from "../models/Notice.js";
import Homework from "../models/Homework.js";
import { auth, checkRole } from "./middleware.js";

const router = express.Router();

router.get("/dashboard", auth, checkRole(["student"]), async (req, res) => {
  const notices = await Notice.find().sort({ date: -1 });
  const homework = await Homework.find().sort({ dueDate: 1 });
  res.json({ success: true, notices, homework });
});

export default router;
