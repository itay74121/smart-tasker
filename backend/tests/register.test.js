const axios = require('axios')


describe("Register Testing",()=>{
    test("test the register endpoint working",async ()=>{
        const response = await axios.post('http://localhost:3000/api/register',{
            email:"itay74121@gmail.com",
            username:"itay74121",
            passwordhash:"6545665564156516516156516"
        })
        expect(response.status).toEqual(201);
        
    })
})
