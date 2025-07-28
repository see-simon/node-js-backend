import express from 'express';
import { login, register } from '../controllers/auth/authController.js';
import { addStudent, deleteStudent, getStudents, updateStudent } from '../controllers/student/studentMarks.js';

const router = express.Router();

router.post('/signup', register);

router.post('/login', login);

// student routes can be added here if needed
router.get('/getStudentsMarks', getStudents);

router.post('/addSubject', addStudent); 

router.delete('/deleteStudentMark/:id', deleteStudent); 
router.put('/updateSubject/:id', updateStudent);
// Add other routes as needed

export default router;
