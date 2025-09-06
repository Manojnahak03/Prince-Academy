import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  standard: String,
  number: String,
  message: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Contact", contactSchema);
