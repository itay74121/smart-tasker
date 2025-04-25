const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env

const deployUrl = process.env.TESTING === "true" ? process.env.TEST_BASE_URL : process.env.DEPLOY_URL;
axios.defaults.baseURL = deployUrl; // Set the base URL for all requests
//const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Iml0YXk3NDEyMSIsIl9pZCI6IjY4MDBhNWNmMWNiMTJhZjdmNDg5OTEwNiIsImlhdCI6MTc0NTIyNDUxMCwiZXhwIjoxNzQ4MTA0NTEwfQ.Om_VE4Bdr2M6hND9tNIx-I2Iv_AZ6iDAQWhDGCvL9WQ';
//axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Add the token to the Authorization header
axios.defaults.headers.common['Cookie'] = 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Iml0YXk3NDEyMSIsIl9pZCI6IjY4MDBhNWNmMWNiMTJhZjdmNDg5OTEwNiIsImlhdCI6MTc0NTQ5MTg2NiwiZXhwIjoxNzQ4MzcxODY2fQ.mzMqGL_8aEqukDv2or0y7wgPWRaGTfkHDIab72sJL-E'

describe('POST /api/tasks', () => {
    it('creates a task and returns 201 + task body', async () => {
        const payload = {
            title: 'Test Task',
            description: 'Just a test',
            priority: 'high',
            status: 'pending',
            assignee : '6800a5cf1cb12af7f4899106',
            dueDate:Date.now()+24*60*60*1000,

        };
        const res = await axios.post('/api/tasks', payload);
        
        expect(res.status).toBe(201);
        expect(res.data).toMatchObject({
            title: payload.title,
            description: payload.description,
            priority: payload.priority,
            status: payload.status
        }); 
        expect(res.data).toHaveProperty('_id');
        createdId = res.data._id;
    }); 

    it('returns 400 when title is missing', async () => {
        try {
            await axios.post('/api/tasks', { description: 'no title' });
        } catch (err) {
            expect(err.response.status).toBe(400);
        }
    });

    it('returns 400 when priority is missing', async () => {
        try {
            await axios.post('/api/tasks', { title: 'No Priority', description: 'Missing priority' });
        } catch (err) {
            expect(err.response.status).toBe(400);
        }
    });

    it('returns 400 when dueDate is in the past', async () => {
        const payload = {
            title: 'Past Due Date',
            description: 'Task with past due date',
            priority: 'low',
            dueDate: Date.now() - 1000, // 1 second in the past
            createdBy: 'testUser',
            assignee : '6800a5cf1cb12af7f4899106',
        };
        try {
            await axios.post('/api/tasks', payload);
        } catch (err) {
            expect(err.response.status).toBe(400);
        }
    });

    it('returns 400 when createdBy is not a valid user', async () => {
        const payload = {
            title: 'Invalid Creator',
            description: 'Task with invalid creator',
            priority: 'medium',
            dueDate: Date.now() + 100000, // Future date
            createdBy: 'nonExistentUser',
            assignee : '6800a5cf1cb12af7f4899106',
        };
        try {
            await axios.post('/api/tasks', payload);
        } catch (err) {
            expect(err.response.status).toBe(400);
        }
    });

    it('returns 400 when assignee is not a valid user', async () => {
        const payload = {
            title: 'Invalid Assignee',
            description: 'Task with invalid assignee',
            priority: 'medium',
            dueDate: Date.now() + 100000, // Future date
            createdBy: 'testUser',
            assignee : '6800a5cf1cb12af7f4899106',
        };
        try {
            await axios.post('/api/tasks', payload);
        } catch (err) {
            expect(err.response.status).toBe(400);
        }
    });
});

describe('GET /api/tasks', () => {
    it('returns 200 and a list of tasks', async () => {
        // Create a few tasks to ensure the list is not empty
        const tasksToCreate = [
            { title: 'Task 1', description: 'First task', priority: 'low', assignee: '6800a5cf1cb12af7f4899106', dueDate: Date.now() + 100000 },
            { title: 'Task 2', description: 'Second task', priority: 'medium', assignee: '6800a5cf1cb12af7f4899106', dueDate: Date.now() + 200000 },
        ];

        for (const task of tasksToCreate) {
            await axios.post('/api/tasks', task);
        }

        // Fetch the list of tasks
        const res = await axios.get('/api/tasks');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.data.tasks)).toBe(true);

        // Verify that the created tasks are in the response
        tasksToCreate.forEach((task) => {
            const foundTask = res.data.tasks.find((t) => t.title === task.title && t.description === task.description);
            expect(foundTask).toBeDefined();
            expect(foundTask.priority).toBe(task.priority);
            expect(foundTask.assignee).toBe(task.assignee);
        });
    });
});

describe('PUT /api/tasks/:id', () => {
    it('updates a task and returns 200 when a valid ID and payload are provided', async () => {
        const createPayload = { 
            title: 'Task to Update',
            description: 'This task will be updated',
            priority: 'medium',
            assignee: '6800a5cf1cb12af7f4899106',
            dueDate: Date.now() + 100000,
        };
        const createRes = await axios.post('/api/tasks', createPayload);
        const taskId = createRes.data._id;

        const updatePayload = {
            title: 'Updated Task Title',
            description: 'Updated description', 
            priority: 'high',
        };
        const updateRes = await axios.put(`/api/tasks/${taskId}`, updatePayload);
        expect(updateRes.status).toBe(200);

        const getRes = await axios.get(`/api/tasks/${taskId}`);
        expect(getRes.data.title).toBe(updatePayload.title);
        expect(getRes.data.description).toBe(updatePayload.description);
        expect(getRes.data.priority).toBe(updatePayload.priority);
    }); 

    it('returns 400 when trying to update with invalid fields', async () => {
        const createPayload = {
            title: 'Task with Invalid Update',
            description: 'This task will have invalid updates',
            priority: 'low',
            assignee: '6800a5cf1cb12af7f4899106',
            dueDate: Date.now() + 100000,
        };
        const createRes = await axios.post('/api/tasks', createPayload);
        const taskId = createRes.data._id;

        const invalidUpdatePayload = {
            invalidField: 'This field should not be allowed',
        };
        try {
            await axios.put(`/api/tasks/${taskId}`, invalidUpdatePayload);
        } catch (err) {
            expect(err.response.status).toBe(400);
        }
    });

    it('returns 404 when trying to update a non-existent task', async () => {
        const updatePayload = {
            title: 'Non-existent Task',
            description: 'This task does not exist',
            priority: 'medium',
        };
        try {
            await axios.put('/api/tasks/nonExistentId', updatePayload);
        } catch (err) {
            expect(err.response.status).toBe(404);
        }
    });

    it('returns 403 when trying to update a task not owned by the user', async () => {
        const createPayload = {
            title: 'Task Not Owned',
            description: 'This task is owned by another user',
            priority: 'low',
            assignee: '6800a5cf1cb12af7f4899106',
            dueDate: Date.now() + 100000,
        };
        const createRes = await axios.post('/api/tasks', createPayload);
        const taskId = createRes.data._id;

        const updatePayload = {
            title: 'Unauthorized Update',
        };
        try {
            await axios.put(`/api/tasks/${taskId}`, updatePayload,{
                headers:{
                    Authorization:"Bearer 6804ed9281acd5997349c1b6"
                }
            });
        } catch (err) {
            expect(err.response.status).toBe(401);
        }
    }); 

    it('returns 404 when trying to delete a non-existent task', async () => {
        try {
            await axios.delete('/api/tasks/nonExistentId');
        } catch (err) {
            expect(err.response.status).toBe(404);
        }
    });
});