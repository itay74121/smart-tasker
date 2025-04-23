const deployUrl = "https://smart-tasker-2ntd.onrender.com"

describe("", () => {  
    test("Health check", async () => {
        const response = await fetch(`${deployUrl}/api/health`);
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({ status: "ok", mongoose_connected: 1});
    });
})



