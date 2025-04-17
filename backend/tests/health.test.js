describe("", () => {  
    test("Health check", async () => {
        const response = await fetch("http://localhost:3000/api/health");
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({ status: "ok", mongoose_connected: 1});
    });
})



