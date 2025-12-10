import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  image: Buffer,
  referenceId: Number,
});

export default mongoose.model("Image", imageSchema);
