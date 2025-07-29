import express from 'express';
import mySql from 'mysql';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// db connection
export const db = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud',
    port: 3306
});

// connect to DB
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// test GET
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM student';
    db.query(sql, (err, result) => {
        if (err) return res.json({ message: 'Error fetching data' });
        return res.json(result);
    });
});

app.listen(3306, () => {
    console.log('Server is running on port 3306');
});
