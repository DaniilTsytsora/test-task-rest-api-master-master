// API
import Router from 'express';
import PostController from './PostController.js';

const router = new Router();

router.post('/registrationUser', PostController.registrationUser);
router.post('/registrationDoc', PostController.registrationDoctor);
router.post('/appointment', PostController.doctorsAppointment);

export default router;
