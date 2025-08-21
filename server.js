import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // serve frontend files

// ✅ MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/classWebsite", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Schema & Model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  standard: String,
  number: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Contact = mongoose.model("Contact", contactSchema);

// ✅ Nodemailer Transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nahakmanoj10@gmail.com",      // 🔑 replace with your Gmail
    pass: "jqcqhtohwqosmari"         // 🔑 replace with Gmail App Password
  }
});

// ✅ POST API - Save Form Data + Send Emails
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, standard, number, message } = req.body;

    // 1️⃣ Save to MongoDB
    const newContact = new Contact({ name, email, standard, number, message });
    await newContact.save();

    // 2️⃣ Send Thank You Email to User
    const userMail = {
      from: "nahakmanoj10@gmail.com",
      to: email,
      subject: "Thank you for contacting us!",
      text: `Hello ${name},\n\nThank you for contacting us.
       We will get back to you shortly.\n\n- Prince Academy`
    };

    // 3️⃣ Send Notification Email to Admin (You)
    const adminMail = {
      from: "nahakmanoj10@gmail.com",
      to: "nahakmanoj10@gmail.com",  // ✅ your own email
      subject: "📩 New Enquiry Received",
      text: `You have received a new enquiry:\n\n
Name: ${name}
Email: ${email}
Standard: ${standard}
Phone: ${number}
Message: ${message}\n\n- Class Website`
    };

    // Send both emails
    await transporter.sendMail(userMail);
    await transporter.sendMail(adminMail);

    res.json({ success: true, message: "Form submitted, data saved & emails sent ✅" });

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ GET API - View All Contacts in JSON
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 }); // latest first
    res.json(contacts);  // send JSON response
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start Server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
  console.log("📌 View form data at: http://localhost:3000/api/contacts");
});