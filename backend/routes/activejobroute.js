import express from 'express';
import JobPost from '../models/JobPost.model.js';
import verifyToken from '../middlewares/authmiddleware.js';
import  getMyJobPosts  from '../controllers/activejobController.js';
const router = express.Router();

router.get('/activejobpost', verifyToken, ConvertToShip,getMyJobPosts);

export default router;
