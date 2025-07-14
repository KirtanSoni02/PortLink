import express from 'express';
import {
  createJobPost,
  getMyJobPosts,
  deleteJobPost,
  getPortOverview,
  getPortDashboardProfile
} from '../controllers/port.js';
import verifyToken from '../middlewares/authmiddleware.js';

const router = express.Router();

router.get('/profile', verifyToken, getPortDashboardProfile);
router.post('/jobs', verifyToken, createJobPost);
router.get('/jobs', verifyToken, getMyJobPosts);
router.delete('/jobs/:id', verifyToken, deleteJobPost);
router.get('/dashboard', verifyToken, getPortOverview);


export default router;
