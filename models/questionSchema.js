import mongoose from "mongoose";
const { Schema } = mongoose;

/** question model */
const questionSchema = new Schema({
    set: { type: String, required: true }, // New field for set identification
    questions: { type: Array, default: [] },
    answers: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Question', questionSchema);