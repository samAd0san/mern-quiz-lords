import express from 'express';

import userController from '../controllers/userCtrl.js'
import { getStudentsByBranch, getStudentsByBranchAndSection } from '../controllers/userCtrl.js';

const router = express.Router();

router.post('/signup',userController.signup);
router.post('/signin',userController.signin);

// New route for fetching user profile by email
router.get('/profile/:email', userController.getUserProfile);

// Route to fetch students by Branch
// http://localhost:5000/users/branch/cse
router.get('/branch/:branch', getStudentsByBranch);

// Route to fetch students by Branch and Section
// http://localhost:5000/users/branch/cse/section/a
router.get('/branch/:branch/section/:section', getStudentsByBranchAndSection);

export default router;