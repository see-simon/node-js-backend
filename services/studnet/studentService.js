import { db } from '../../server.js';
// ...existing code...

export const getStudentMarks = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM student';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching students:', err);
                return reject(err);
            }
            resolve(result);
        });
    });
};

export const addStudentMark = (student) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO student (subjectName, mark) VALUES (?, ?)';
        db.query(sql, [student.subjectName, student.mark], (err, result) => {
            if (err) {
                console.error('Error adding student:', err);
                return reject(err);
            }
            resolve({ success: true, student: { ...student, ID: result.insertId } });
        });
    });
};


export const updateStudentMark = (student) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE student SET subjectName = ?, mark = ? WHERE ID = ?';
        
        db.query(sql, [student.subjectName, student.mark, student.ID], (err, result) => {
            if (err) {
                console.error('Error updating student:', err);   
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve({ success: false, message: 'Student not found' });
            }
            resolve({ success: true, student });
        });

    });
};

export const deleteStudentMark = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM student WHERE ID = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting student:', err);
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return resolve({ success: false, message: 'Student not found' });
            }
            resolve({ success: true, message: 'Student deleted successfully' });
        });
    });
}