import express from 'express';

import userController from '../controllers/userCtrl.js'

const router = express.Router();

router.post('/signup',userController.signup);
router.post('/signin',userController.signin);

// New route for fetching user profile by email
router.get('/profile/:email', userController.getUserProfile);

export default router;