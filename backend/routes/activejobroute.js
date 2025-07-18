import express from 'express';
import JobPost from '../models/JobPost.model.js';
import verifyToken from '../middlewares/authmiddleware.js';
import { getMyJobPosts , ConvertToShip ,deleteJobPost, updateJobPost}  from '../controllers/activejobController.js';
const router = express.Router();

router.get('/activejobpost', verifyToken, getMyJobPosts , ConvertToShip);

router.delete('/delete/:jobId', verifyToken, deleteJobPost);
router.put('/edit/:jobId', verifyToken, updateJobPost);

export default router;
