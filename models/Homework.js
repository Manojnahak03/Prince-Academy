import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema({
  subject: String,
  details: String,
  dueDate: Date,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Homework", homeworkSchema);
