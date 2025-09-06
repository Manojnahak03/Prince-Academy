import express from "express";
import Contact from "../models/Contact.js";
import { transporter } from "../server.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, standard, number, message } = req.body;

    const newContact = new Contact({ name, email, standard, number, message });
    await newContact.save();

    const userMail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting us!",
      text: `Hello ${name},\n\nThank you for contacting us. We will get back to you shortly.\n\n- Class Website`,
    };

    const adminMail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "📩 New Enquiry Received",
      text: `You have received a new enquiry:\n\n
Name: ${name}
Email: ${email}
Standard: ${standard}
Phone: ${number}
Message: ${message}\n\n- Class Website`,
    };

    await transporter.sendMail(userMail);
    await transporter.sendMail(adminMail);

    res.json({ success: true, message: "Form submitted, data saved & emails sent ✅" });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
