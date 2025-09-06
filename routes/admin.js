import express from "express";
import Notice from "../models/Notice.js";
import Homework from "../models/Homework.js";
import { auth, checkRole } from "./middleware.js";

const router = express.Router();

// Upload Notice
router.post("/notice", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { title, content } = req.body;
    const notice = new Notice({ title, content });
    await notice.save();
    res.json({ success: true, message: "Notice uploaded ✅" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Upload Homework
router.post("/homework", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const { subject, details, dueDate } = req.body;
    const homework = new Homework({ subject, details, dueDate });
    await homework.save();
    res.json({ success: true, message: "Homework uploaded ✅" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// List all
router.get("/list", auth, checkRole(["admin"]), async (req, res) => {
  const notices = await Notice.find().sort({ date: -1 });
  const homework = await Homework.find().sort({ dueDate: 1 });
  res.json({ success: true, notices, homework });
});

// Delete
router.delete("/notice/:id", auth, checkRole(["admin"]), async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Notice deleted ✅" });
});

router.delete("/homework/:id", auth, checkRole(["admin"]), async (req, res) => {
  await Homework.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Homework deleted ✅" });
});

export default router;
