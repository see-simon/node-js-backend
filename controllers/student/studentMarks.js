import { getStudentMarks, addStudentMark, deleteStudentMark, updateStudentMark } from "../../services/studnet/studentService.js";
import studentModel from '../../models/studentModel.js';

export const getStudents = async (req, res) => {
    try {
        const students = await getStudentMarks();
        return res.status(200).json(students);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
}

export const addStudent = async (req, res) => {
    const { subjectName, mark } = req.body;

    // Validation
    if (!subjectName || !mark) {
        return res.status(400).json({ message: 'Subject name and mark are required' });
    }

    const student = new studentModel({ subjectName, mark });

    try {
        const result = await addStudentMark(student);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(201).json({
            message: 'Student added successfully',
            student: result.student || null
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding student', error: error.message });
    }
}

// ...existing code...

export const updateStudent = async (req, res) => {
    const { subjectName, mark } = req.body;
    const ID = req.body.ID || req.params.id; // Get ID from params if not in body

    // Validation
    if (!ID || !subjectName || !mark) {
         return res.status(400).json({ message: 'Subject name and mark are required' });
    }
    const student = new studentModel({ ID, subjectName, mark });
    try {
        const result = await updateStudentMark(student);
        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json({
            message: 'Student updated successfully',
            student: result.student || null
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating student', error: error.message });
    }
}

// ...existing code...

export const deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await deleteStudentMark(id);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json({
            message: 'Student deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting student', error: error.message });
    }
}


