import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:8081/api/auth';

test.describe('Auth API Tests', () => {

  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'Test1234!';

  test('✅ Register a new user successfully', async ({ request }) => {
    const res = await request.post(`${baseURL}/signup`, {
      data: {
        name: 'Test',
        surname: 'User',
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword
      }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.message).toBe('User created successfully');
  });

  test('❌ Register fails when email already exists', async ({ request }) => {
    const res = await request.post(`${baseURL}/signup`, {
      data: {
        name: 'Test',
        surname: 'User',
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword
      }
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe('Email already registered');
  });

  test('❌ Register fails with mismatched passwords', async ({ request }) => {
    const res = await request.post(`${baseURL}/signup`, {
      data: {
        name: 'Mismatch',
        surname: 'User',
        email: `mismatch_${Date.now()}@example.com`,
        password: '1234',
        confirmPassword: '5678'
      }
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe('Passwords do not match');
  });

  test('✅ Login with correct credentials', async ({ request }) => {
    const res = await request.post(`${baseURL}/login`, {
      data: { email: testEmail, password: testPassword }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.message).toBe('Login successful');
    expect(body.userId).toBeDefined();
  });

  test('❌ Login fails with wrong password', async ({ request }) => {
    const res = await request.post(`${baseURL}/login`, {
      data: { email: testEmail, password: 'WrongPass123' }
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.message).toBe('Invalid email or password');
  });

  test('❌ Login fails with missing fields', async ({ request }) => {
    const res = await request.post(`${baseURL}/login`, {
      data: { email: '', password: '' }
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe('Email and password are required');
  });

});

test.describe('Student Marks API Tests', () => {

  let studentId;

  test('GET /getStudentsMarks returns list', async ({ request }) => {
    const res = await request.get(`${baseURL}/getStudentsMarks`);
    expect(res.status()).toBe(200);
    const students = await res.json();
    expect(Array.isArray(students)).toBeTruthy();
  });

  test('POST /addSubject adds a student mark', async ({ request }) => {
    const payload = { subjectName: 'Math', mark: 90 };
    const res = await request.post(`${baseURL}/addSubject`, { data: payload });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.message).toBe('Student added successfully');
    expect(body.student.subjectName).toBe(payload.subjectName);
    expect(body.student.mark).toBe(payload.mark);
    expect(body.student.ID).toBeDefined();

    studentId = body.student.ID; // save for next tests
  });

  test('POST /addSubject fails with missing fields', async ({ request }) => {
    const res = await request.post(`${baseURL}/addSubject`, { data: { subjectName: '', mark: null } });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe('Subject name and mark are required');
  });

  test('PUT /updateSubject/:id updates a student mark', async ({ request }) => {
    const payload = { subjectName: 'Physics', mark: 95, ID: studentId };
    const res = await request.put(`${baseURL}/updateSubject/${studentId}`, { data: payload });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.message).toBe('Student updated successfully');
    expect(body.student.subjectName).toBe(payload.subjectName);
    expect(body.student.mark).toBe(payload.mark);
  });

  test('PUT /updateSubject/:id fails with invalid ID', async ({ request }) => {
    const payload = { subjectName: 'Chemistry', mark: 80, ID: 999999 };
    const res = await request.put(`${baseURL}/updateSubject/999999`, { data: payload });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe('Student not found');
  });

  test('PUT /updateSubject/:id fails with missing fields', async ({ request }) => {
    const payload = { subjectName: '', mark: null, ID: studentId };
    const res = await request.put(`${baseURL}/updateSubject/${studentId}`, { data: payload });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe('ID, subject name, and mark are required');
  });

  test('DELETE /deleteStudentMark/:id deletes a student mark', async ({ request }) => {
    const res = await request.delete(`${baseURL}/deleteStudentMark/${studentId}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.message).toBe('Student deleted successfully');
  });

  test('DELETE /deleteStudentMark/:id fails with invalid ID', async ({ request }) => {
    const res = await request.delete(`${baseURL}/deleteStudentMark/999999`);
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe('Student not found');
  });

});
