require('dotenv').config(); // Load environment variables from .env

const deployUrl = process.env.TESTING === true ? process.env.TEST_BASE_URL : process.env.DEPLOY_URL;

describe("", () => {  
    test("Health check", async () => {
        const response = await fetch(`${deployUrl}/api/health`);
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({ status: "ok", mongoose_connected: 1});
    });
})



