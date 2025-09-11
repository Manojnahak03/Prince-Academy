import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

// Routes
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import studentRoutes from "./routes/student.js";
import contactRoutes from "./routes/contact.js";

// Models
import User from "./models/User.js";
//Connect.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err.message));

// Nodemailer transporter
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) console.log("❌ Nodemailer Error:", err);
  else console.log("✅ Nodemailer Ready");
});

// Use Routes
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/contact", contactRoutes);

// Dummy Users
const createDummyUsers = async () => {
  const adminExists = await User.findOne({ email: "admin@class.com" });
  if (!adminExists) {
    const admin = new User({ name: "Admin", email: "admin@class.com", password: "admin123", role: "admin" });
    await admin.save();
    console.log("✅ Dummy Admin Created: admin@class.com / admin123");
  }
  const studentExists = await User.findOne({ email: "student@class.com" });
  if (!studentExists) {
    const student = new User({ name: "Student", email: "student@class.com", password: "student123", role: "student" });
    await student.save();
    console.log("✅ Dummy Student Created: student@class.com / student123");
  }
};

createDummyUsers();

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
