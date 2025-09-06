import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Notice", noticeSchema);
