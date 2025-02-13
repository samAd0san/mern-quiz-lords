import bcrypt from 'bcrypt';
import UserRepo from '../repositories/userRepo.js';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import User from '../models/userModel.js';

const emailExists = (err) => err.message 
    && err.message.indexOf('duplicate key error') > -1;

const signup = async(req,res) => {
    try{
        const payload = req.body;
        payload.password = await bcrypt.hash(payload.password, 2);
        
        console.log('User Added:',payload);
        payload.createdDate = new Date();
        
        
        await UserRepo.signup(payload);

        res.status(201).send('Created');   
    }catch(err){
        console.log(err.message);
        if(emailExists(err)){
            res.status(400).send('Email Already Exists');
        }else{
            res.status(500).send('Internal Server Error');
        }
    }
};

const signin = async(req,res) => {
    try {
        const payload = req.body;
        const dbUser = await UserRepo.getUserByEmail(payload.email);

        if(!dbUser){
            res.status(404).send('Invalid Email');
            return;
        }

        const isValid = await bcrypt.compare(payload.password,dbUser.password); 

        if(isValid){
            console.log('JWT Secret:', config.jwtSecret);
            res.status(200).json({
                username: dbUser.username,
                token: jwt.sign({email: dbUser.email}, config.jwtSecret, {expiresIn: '1d'}),
            });
        }else{
            res.status(401).send('Invalid password');
        }
    }catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
};

const getUserProfile = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await UserRepo.getUserByEmail(email);

        if (user) {
            res.status(200).json({
                firstName: user.firstName,
                lastName: user.lastName,
                rollNo: user.rollNo,
                branch: user.Branch,
                section: user.Section,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        logger.error({
            location: 'userCtrl - getUserProfile',
            error: error,
        });
        res.status(500).send('Internal Server Error');
    }
};

// Fetch students by Branch (CASE SENSITIVE)
export const getStudentsByBranch = async (req, res) => {
    const { branch } = req.params;

    try {
        // Use case-insensitive regex for branch
        const students = await User.find({ Branch: { $regex: new RegExp(`^${branch}$`, 'i') } });

        if (!students.length) {
            return res.status(404).json({ message: `No students found in the branch ${branch}` });
        }

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Fetch students by Branch and Section (CASE SENSITIVE)
export const getStudentsByBranchAndSection = async (req, res) => {
    const { branch, section } = req.params;

    try {
        // Use case-insensitive regex for both branch and section
        const students = await User.find({
            Branch: { $regex: new RegExp(`^${branch}$`, 'i') },
            Section: { $regex: new RegExp(`^${section}$`, 'i') }
        });

        if (!students.length) {
            return res.status(404).json({ message: `No students found in the branch ${branch}, section ${section}` });
        }

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export default {
    signup,
    signin,
    getUserProfile,
    getStudentsByBranch,
    getStudentsByBranchAndSection,
};