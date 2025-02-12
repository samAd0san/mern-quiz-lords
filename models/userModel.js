import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is mandatory'],
        minLength: [4, 'Min 4 characters'],
        maxLength: [15, 'Max 15 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is Required']
    },  
    rollNo: {
        type: String,
        required: [true, 'Roll No is Required']
    },
    Branch: {
        type: String,
        required: [true, 'Branch is Required']
    },
    Section: {
        type: String,
        required: [true, 'Section is Required']
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: function(value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Invalid Email'
        }
    },
    password: { type: String },
    active: { type: Boolean, default: true },
    role: { type: String, default: 'User' },
    createdDate: { type: Date },
    updatedDate: { type: Date, default: Date.now }
});

const User = mongoose.model('users', schema);
export default User;
