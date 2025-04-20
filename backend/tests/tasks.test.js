const axios = require('axios');


axios.defaults.baseURL = 'http://localhost:3000'; // Set the base URL for all requests
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Iml0YXk3NDEyMSIsIl9pZCI6IjY4MDBhNWNmMWNiMTJhZjdmNDg5OTEwNiIsImlhdCI6MTc0NTA0ODU1NiwiZXhwIjoxNzQ3OTI4NTU2fQ.GbcmzGdoFzxhI8ixYHlEgUpnHeJN1Xkp4jZmFJlsJlo';
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Add the token to the Authorization header
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

describe('GET /api/tasks/:id', () => {
    it('returns 200 and the task when a valid ID is provided', async () => {
        const payload = {  
            title: 'Task to Retrieve',
            description: 'Retrieve this task',
            priority: 'high',
            status: 'pending',
            assignee : '6800a5cf1cb12af7f4899106',
            dueDate: Date.now() + 3600*24*7*1000
        };
        const createRes = await axios.post('/api/tasks', payload);
        const taskId = createRes.data._id;
        const res = await axios.get(`/api/tasks/${taskId}`);
        expect(res.status).toBe(200);
        payload['dueDate'] = new Date(payload['dueDate']).toISOString()
        Object.entries(payload).forEach(([key, val]) => {
            expect(res.data[key]).toBe(val);
          });
    });

    it('returns 404 when a task with the given ID does not exist', async () => {
        try {
            await axios.get('/api/tasks/nonExistentId');  
        } catch (err) {
            expect(err.response.status).toBe(404);
        }
    });
});

describe('DELETE /api/tasks/:id', () => { 
    it('deletes a task and returns 200 when a valid ID is provided', async () => {
        const payload = { title: 'Task 1', description: 'First task', priority: 'low', assignee: '6800a5cf1cb12af7f4899106', dueDate: Date.now() + 100000 }
        const createRes = await axios.post('/api/tasks', payload);
        const taskId = createRes.data._id;

        const deleteRes = await axios.delete(`/api/tasks/${taskId}`);
        expect(deleteRes.status).toBe(200);

        try {
            await axios.get(`/api/tasks/${taskId}`);
        } catch (err) {
            expect(err.response.status).toBe(404);
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