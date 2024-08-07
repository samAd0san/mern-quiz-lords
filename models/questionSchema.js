import mongoose from "mongoose";
const { Schema } = mongoose;

/** question model */
const questionSchema = new Schema({
    set: { type: String, required: true },
    questions: { type: Array, default: [] },  // Ensure this matches API response
    answers: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Question', questionSchema);
